import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Edit product' };

export default function EditProductPage({ params }) {
  return <ProductForm productId={params.id} />;
}
