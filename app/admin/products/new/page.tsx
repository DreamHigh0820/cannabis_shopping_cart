import ProductForm from "../ProductForm"
import BackButton from "../../../../components/BackButton"

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
