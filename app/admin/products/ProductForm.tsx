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
import MediaUpload from "@/components/MediaUpload"
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
  const [image2Url, setImage2Url] = useState<string>(product?.image2 || "")
  const [mediaUrl, setMediaUrl] = useState<string>(product?.media || "")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedImage2File, setSelectedImage2File] = useState<File | null>(null)
  const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null)
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
      image2: product?.image2 || "",
      media: product?.media || "",
      description: product?.description || "",
      nose: product?.nose || "",
      strain: product?.strain || "Indica",
      isQP: product?.isQP || false,
      featured: product?.featured || false,
      qpPrice: product?.qpPrice || 0,
      rating: product?.rating || 4.0,
      isOnSale: product?.isOnSale || false,
      salePrice: product?.salePrice || 0,
    },
  })

  // Watch the isQP and isOnSale checkbox values
  const isQPChecked = watch("isQP")
  const isOnSaleChecked = watch("isOnSale")

  useEffect(() => {
    if (product) {
      setImageUrl(product.image || "")
      setImage2Url(product.image2 || "")
      setMediaUrl(product.media || "")
      reset({
        code: product.code,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        cost: product.cost,
        image: product.image,
        image2: product.image2,
        media: product.media,
        description: product.description,
        nose: product.nose,
        strain: product.strain,
        isQP: product.isQP,
        featured: product.featured,
        qpPrice: product.qpPrice || 0,
        rating: product.rating || 4.0,
        isOnSale: product.isOnSale || false,
        salePrice: product.salePrice || 0,
      })
    }
  }, [product, reset])

  // Handle image URL changes (for existing images)
  const handleImageChange = (newImageUrl: string) => {
    setImageUrl(newImageUrl)
    setValue("image", newImageUrl)
  }

  const handleImage2Change = (newImageUrl: string) => {
    setImage2Url(newImageUrl)
    setValue("image2", newImageUrl)
  }

  // Handle media URL changes (for existing media)
  const handleMediaChange = (newMediaUrl: string) => {
    setMediaUrl(newMediaUrl)
    setValue("media", newMediaUrl)
  }

  // Handle new file selection (don't upload yet)
  const handleImageFileChange = (file: File | null) => {
    setSelectedImageFile(file)
  }

  const handleImage2FileChange = (file: File | null) => {
    setSelectedImage2File(file)
  }

  const handleMediaFileChange = (file: File | null) => {
    setSelectedMediaFile(file)
  }

  // Upload file to Vercel Blob
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Failed to upload file')
    }

    return result.imageUrl // The API returns imageUrl for any file type
  }

  // Delete uploaded file if product creation fails
  const deleteUploadedFile = async (fileUrl: string, isImage: boolean = true) => {
    try {
      const endpoint = isImage ? '/api/admin/delete-image' : '/api/admin/delete-media'
      const bodyKey = isImage ? 'imageUrl' : 'mediaUrl'
      
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [bodyKey]: fileUrl })
      })
    } catch (error) {
      console.error(`Failed to cleanup uploaded ${isImage ? 'image' : 'media'}:`, error)
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

    // Validate sale price if on sale is checked
    if (data.isOnSale && (!data.salePrice || data.salePrice <= 0)) {
      errors.push("Sale price must be greater than 0 when item is on sale")
    }

    // Validate that sale price is less than regular price
    if (data.isOnSale && data.salePrice && data.price && data.salePrice >= data.price) {
      errors.push("Sale price must be less than the regular price")
    }

    // Validate required text fields
    if (!data.name?.trim()) {
      errors.push("Product name is required")
    }

    if (!imageUrl && !selectedImageFile) {
      errors.push("Product image is required")
    }

    return errors
  }

  const onSubmit = async (data: FormData) => {
    // Clear previous validation errors
    setValidationErrors([])

    // Validate form data BEFORE uploading files
    const validationErrors = validateForm(data)
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors)
      toast.error("Please fix the validation errors below")
      return
    }

    setUploading(true)
    let finalImageUrl = imageUrl || ""
    let finalImage2Url = image2Url || ""
    let finalMediaUrl = mediaUrl || ""
    let uploadedImageUrl: string | null = null
    let uploadedImage2Url: string | null = null
    let uploadedMediaUrl: string | null = null

    try {
      // Step 1: Upload image to Vercel Blob if a new file is selected
      if (selectedImageFile) {
        toast.loading('Uploading image to Vercel Blob...', { id: 'upload-image' })
        uploadedImageUrl = await uploadFile(selectedImageFile)
        finalImageUrl = uploadedImageUrl
        toast.success('Image uploaded successfully!', { id: 'upload-image' })
      }

      // Step 2: Upload second image to Vercel Blob if a new file is selected
      if (selectedImage2File) {
        toast.loading('Uploading second image to Vercel Blob...', { id: 'upload-image2' })
        uploadedImage2Url = await uploadFile(selectedImage2File)
        finalImage2Url = uploadedImage2Url
        toast.success('Second image uploaded successfully!', { id: 'upload-image2' })
      }

      // Step 3: Upload media to Vercel Blob if a new file is selected
      if (selectedMediaFile) {
        toast.loading('Uploading media to Vercel Blob...', { id: 'upload-media' })
        uploadedMediaUrl = await uploadFile(selectedMediaFile)
        finalMediaUrl = uploadedMediaUrl
        toast.success('Media uploaded successfully!', { id: 'upload-media' })
      }

      // Step 4: Prepare product data with final URLs
      const submitData = {
        ...data,
        image: finalImageUrl,
        image2: finalImage2Url,
        media: finalMediaUrl
      }

      // Step 5: Submit product data
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

        // If product creation failed and we uploaded files, delete them
        if (!isEditing) {
          if (uploadedImageUrl) {
            await deleteUploadedFile(uploadedImageUrl, true)
          }
          if (uploadedImage2Url) {
            await deleteUploadedFile(uploadedImage2Url, true)
          }
          if (uploadedMediaUrl) {
            await deleteUploadedFile(uploadedMediaUrl, false)
          }
        }

        throw new Error(errorData.message || "Failed to save product")
      }

      const result = await response.json()

      toast.success(result.message || `Product ${isEditing ? "updated" : "created"} successfully!`, { id: 'product' })
      router.push("/admin/products")
      router.refresh()

    } catch (error) {
      console.error('Error saving product:', error)

      // If we uploaded files but product creation failed, clean them up
      if (!isEditing) {
        if (uploadedImageUrl) {
          await deleteUploadedFile(uploadedImageUrl, true)
        }
        if (uploadedImage2Url) {
          await deleteUploadedFile(uploadedImage2Url, true)
        }
        if (uploadedMediaUrl) {
          await deleteUploadedFile(uploadedMediaUrl, false)
        }
        toast.error('Product creation failed. Uploaded files have been removed.')
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
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
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
              Product Code (Optional)
            </Label>
            <Input
              id="code"
              {...register("code")}
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
                    {/* <SelectItem value="Miscellaneous">Miscellaneous</SelectItem> */}
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
                    <SelectItem value="Indica-Dominant-Hybrid">Indica Dominant Hybrid</SelectItem>
                    <SelectItem value="Sativa-Dominant-Hybrid">Sativa Dominant Hybrid</SelectItem>
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
              Quantity (Optional)
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              {...register("quantity", {
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

          {/* Primary Image Upload Section - Full Width */}
          <div className="space-y-2 md:col-span-2">
            <ImageUpload
              currentImage={imageUrl}
              onImageChange={handleImageChange}
              onFileChange={handleImageFileChange}
              label="Primary Product Image"
              required={!isEditing}
              uploading={uploading}
            />

            {selectedImageFile && (
              <p className="text-sm text-blue-600">
                ✓ New primary image selected: {selectedImageFile.name} (will be uploaded to Vercel Blob when you save)
              </p>
            )}
          </div>

          {/* Second Image Upload Section - Full Width */}
          <div className="space-y-2 md:col-span-2">
            <ImageUpload
              currentImage={image2Url}
              onImageChange={handleImage2Change}
              onFileChange={handleImage2FileChange}
              label="Second Product Image (Optional)"
              required={false}
              uploading={uploading}
            />

            {selectedImage2File && (
              <p className="text-sm text-blue-600">
                ✓ New second image selected: {selectedImage2File.name} (will be uploaded to Vercel Blob when you save)
              </p>
            )}
          </div>

          {/* Media Upload Section - Full Width */}
          <div className="space-y-2 md:col-span-2">
            <MediaUpload
              currentMedia={mediaUrl}
              onMediaChange={handleMediaChange}
              onFileChange={handleMediaFileChange}
              label="Product Media"
              required={true}
              uploading={uploading}
            />

            {selectedMediaFile && (
              <p className="text-sm text-blue-600">
                ✓ New media selected: {selectedMediaFile.name} (will be uploaded to Vercel Blob when you save)
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

          {/* Sale Checkbox */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isOnSale"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="isOnSale"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
              )}
            />
            <Label htmlFor="isOnSale">Is this item on sale?</Label>
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

          {/* Conditionally show sale price field */}
          {isOnSaleChecked && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="salePrice">
                Sale Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0.01"
                {...register("salePrice", {
                  required: isOnSaleChecked ? "Sale price is required when item is on sale" : false,
                  valueAsNumber: true,
                  min: { value: 0.01, message: "Sale price must be greater than 0" },
                })}
                placeholder="Enter the discounted price"
              />
              {errors.salePrice && <p className="text-sm text-red-500">{errors.salePrice.message}</p>}
              <p className="text-sm text-gray-500">
                This price will be displayed instead of the regular price when the item is on sale.
              </p>
            </div>
          )}

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nose">Nose (Optional)</Label>
            <Textarea id="nose" {...register("nose")} />
          </div>
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