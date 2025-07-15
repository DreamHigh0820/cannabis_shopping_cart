"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import type { Product } from "@/lib/models/Product"

interface ProductFormProps {
  product?: Product
  isEditing?: boolean
}

type FormData = Omit<Product, "_id" | "createdAt" | "updatedAt">

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      code: product?.code || "",
      name: product?.name || "",
      category: product?.category || "flowers",
      price: product?.price || 0,
      quantity: product?.quantity || 0,
      cost: product?.cost || 0,
      image: product?.image || "",
      description: product?.description || "",
      nose: product?.nose || "",
      strain: product?.strain || "Indica",
      isQP: product?.isQP || false,
      featured: product?.featured || false,
      qpPrice: product?.qpPrice || 0, // Add this field to your Product type
    },
  })

  // Watch the isQP checkbox value
  const isQPChecked = watch("isQP")

  useEffect(() => {
    if (product) {
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
      })
    }
  }, [product, reset])

  const onSubmit = async (data: FormData) => {
    const apiEndpoint = isEditing ? `/api/admin/products/${product?._id}` : "/api/admin/products"
    const method = isEditing ? "PUT" : "POST"

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save product")
      }

      toast.success(`Product ${isEditing ? "updated" : "created"} successfully!`)
      router.push("/admin/products")
      router.refresh() // Ensures the product list is updated
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register("name", { required: "Product name is required" })} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Product Code</Label>
          <Input id="code" {...register("code", { required: "Product code is required" })} />
          {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <Label htmlFor="strain">Strain</Label>
          <Controller
            name="strain"
            control={control}
            rules={{ required: "Strain is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price must be positive" },
            })}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: { value: 0, message: "Quantity must be positive" },
            })}
          />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost ($) (Admin only)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            {...register("cost", {
              required: "Cost is required",
              valueAsNumber: true,
              min: { value: 0, message: "Cost must be positive" },
            })}
          />
          {errors.cost && <p className="text-sm text-red-500">{errors.cost.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" {...register("image", { required: "Image URL is required" })} />
          {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
        </div>
        <div className="flex space-x-2">
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nose">Nose</Label>
          <Textarea id="nose" {...register("nose")} />
        </div>
        <div className="flex space-x-2">
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

        {/* Conditionally show QP price field */}
        {isQPChecked && (
          <div className="space-y-2">
            <Label htmlFor="qpPrice">QP Price ($)</Label>
            <Input
              id="qpPrice"
              type="number"
              step="0.01"
              {...register("qpPrice", {
                required: isQPChecked ? "QP price is required when QP is selected" : false,
                valueAsNumber: true,
                min: { value: 0, message: "QP price must be positive" },
              })}
            />
            {errors.qpPrice && <p className="text-sm text-red-500">{errors.qpPrice.message}</p>}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}