import { GallerySection } from './_sections/gallery-section';
import { ImagesSection } from './_sections/images-section';

export default function Page() {
  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-10'>
        <ImagesSection />
        <GallerySection />
      </div>
    </div>
  );
}
