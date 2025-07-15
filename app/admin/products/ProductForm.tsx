"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/ImageUpload"
import toast from "react-hot-toast"
import type { Product } from "@/lib/models/Product"

interface ProductFormProps {
  product?: Product
  isEditing?: boolean
}

type FormData = Omit<Product, "_id" | "createdAt" | "updatedAt">

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>(product?.image || "")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      code: product?.code || "",
      name: product?.name || "",
      category: product?.category || "Flower",
      price: product?.price || 0,
      quantity: product?.quantity || 0,
      cost: product?.cost || 0,
      image: product?.image || "",
      description: product?.description || "",
      nose: product?.nose || "",
      strain: product?.strain || "Indica",
      isQP: product?.isQP || false,
      featured: product?.featured || false,
      qpPrice: product?.qpPrice || 0,
      rating: product?.rating || 4.0,
    },
  })

  // Watch the isQP checkbox value
  const isQPChecked = watch("isQP")

  useEffect(() => {
    if (product) {
      setImageUrl(product.image || "")
      reset({
        code: product.code,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        cost: product.cost,
        image: product.image,
        description: product.description,
        nose: product.nose,
        strain: product.strain,
        isQP: product.isQP,
        featured: product.featured,
        qpPrice: product.qpPrice || 0,
        rating: product.rating || 4.0,
      })
    }
  }, [product, reset])

  // Handle image URL changes (for existing images)
  const handleImageChange = (newImageUrl: string) => {
    setImageUrl(newImageUrl)
    setValue("image", newImageUrl)
  }

  // Handle new file selection (don't upload yet)
  const handleFileChange = (file: File | null) => {
    setSelectedImageFile(file)
  }

  // Upload image to server
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Failed to upload image')
    }

    return result.imageUrl
  }

  // Delete uploaded image if product creation fails
  const deleteUploadedImage = async (imageUrl: string) => {
    try {
      await fetch('/api/admin/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      })
    } catch (error) {
      console.error('Failed to cleanup uploaded image:', error)
    }
  }

  const validateForm = (data: FormData): string[] => {
    const errors: string[] = []

    // Validate price
    if (!data.price || data.price <= 0) {
      errors.push("Price must be greater than 0")
    }

    // Validate quantity
    if (data.quantity < 0) {
      errors.push("Quantity cannot be negative")
    }

    // Validate cost
    if (!data.cost || data.cost <= 0) {
      errors.push("Cost must be greater than 0")
    }

    // Validate QP price if QP is checked
    if (data.isQP && (!data.qpPrice || data.qpPrice <= 0)) {
      errors.push("QP price must be greater than 0 when QP is selected")
    }

    // Validate required text fields
    if (!data.name?.trim()) {
      errors.push("Product name is required")
    }

    if (!data.code?.trim()) {
      errors.push("Product code is required")
    }

    if (!data.description?.trim()) {
      errors.push("Product description is required")
    }

    if (!imageUrl && !selectedImageFile) {
      errors.push("Product image is required")
    }

    return errors
  }

  const onSubmit = async (data: FormData) => {
    // Clear previous validation errors
    setValidationErrors([])

    // Validate form data BEFORE uploading image
    const validationErrors = validateForm(data)
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors)
      toast.error("Please fix the validation errors below")
      return
    }

    setUploading(true)
    let finalImageUrl = imageUrl || "" // Default to empty string if no image
    let uploadedImageUrl: string | null = null

    try {
      // Step 1: Upload image if a new file is selected
      if (selectedImageFile) {
        toast.loading('Uploading image...', { id: 'upload' })
        uploadedImageUrl = await uploadImage(selectedImageFile)
        finalImageUrl = uploadedImageUrl
        toast.success('Image uploaded successfully!', { id: 'upload' })
      }

      // Step 2: Prepare product data with final image URL (can be empty for editing)
      const submitData = {
        ...data,
        image: finalImageUrl // This can be empty string for editing
      }

      // Step 3: Submit product data
      const apiEndpoint = isEditing ? `/api/admin/products/${product?._id}` : "/api/admin/products"
      const method = isEditing ? "PUT" : "POST"

      toast.loading(`${isEditing ? 'Updating' : 'Creating'} product...`, { id: 'product' })

      const response = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // If product creation failed and we uploaded an image, delete it
        if (uploadedImageUrl && !isEditing) {
          await deleteUploadedImage(uploadedImageUrl)
        }

        throw new Error(errorData.message || "Failed to save product")
      }

      const result = await response.json()

      toast.success(result.message || `Product ${isEditing ? "updated" : "created"} successfully!`, { id: 'product' })
      router.push("/admin/products")
      router.refresh()

    } catch (error) {
      console.error('Error saving product:', error)

      // If we uploaded an image but product creation failed, clean it up
      if (uploadedImageUrl && !isEditing) {
        await deleteUploadedImage(uploadedImageUrl)
        toast.error('Product creation failed. Uploaded image has been removed.')
      }

      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: "Product name is required",
                validate: value => value?.trim() ? true : "Product name cannot be empty"
              })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">
              Product Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: "Product code is required",
                validate: value => value?.trim() ? true : "Product code cannot be empty"
              })}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flower">Flower</SelectItem>
                    <SelectItem value="Vape">Vape</SelectItem>
                    <SelectItem value="Edible">Edible</SelectItem>
                    <SelectItem value="Concentrate">Concentrate</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="strain">
              Strain <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="strain"
              control={control}
              rules={{ required: "Strain is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a strain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indica">Indica</SelectItem>
                    <SelectItem value="Sativa">Sativa</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.strain && <p className="text-sm text-red-500">{errors.strain.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Price ($) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
                min: { value: 0, message: "Quantity cannot be negative" },
              })}
            />
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">
              Cost ($) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0.01"
              {...register("cost", {
                required: "Cost is required",
                valueAsNumber: true,
                min: { value: 0.01, message: "Cost must be greater than 0" },
              })}
            />
            {errors.cost && <p className="text-sm text-red-500">{errors.cost.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">
              Rating (0-5) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register("rating", {
                required: "Rating is required",
                valueAsNumber: true,
                min: { value: 0, message: "Rating must be between 0 and 5" },
                max: { value: 5, message: "Rating must be between 0 and 5" },
              })}
            />
            {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
          </div>

          {/* Image Upload Section - Full Width */}
          <div className="space-y-2 md:col-span-2">
            <ImageUpload
              currentImage={imageUrl}
              onImageChange={handleImageChange}
              onFileChange={handleFileChange}
              label="Product Image"
              required={!isEditing}
              uploading={uploading}
            />

            {selectedImageFile && (
              <p className="text-sm text-blue-600">
                ✓ New image selected: {selectedImageFile.name} (will be uploaded when you save)
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="featured"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              )}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isQP"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="isQP"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              )}
            />
            <Label htmlFor="isQP">Is this a QP Flower product?</Label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
                validate: value => value?.trim() ? true : "Description cannot be empty"
              })}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nose">Nose (Optional)</Label>
            <Textarea id="nose" {...register("nose")} />
          </div>

          {/* Conditionally show QP price field */}
          {isQPChecked && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="qpPrice">
                QP Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="qpPrice"
                type="number"
                step="0.01"
                min="0.01"
                {...register("qpPrice", {
                  required: isQPChecked ? "QP price is required when QP is selected" : false,
                  valueAsNumber: true,
                  min: { value: 0.01, message: "QP price must be greater than 0" },
                })}
              />
              {errors.qpPrice && <p className="text-sm text-red-500">{errors.qpPrice.message}</p>}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className="min-w-32"
          >
            {uploading ? "Uploading..." : isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}