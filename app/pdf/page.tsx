// app/pdf/page.tsx
import UploadForm from '../../components/pdf/UploadForm';

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='w-96'>
        <UploadForm />
      </div>
    </main>
  );
}
