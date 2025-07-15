import ProductForm from "../ProductForm"
import BackButton from "../../../../components/BackButton"

export default function NewProductPage() {
  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton to="/admin/products" />
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  )
}