import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AuthForm } from '@/components/auth/auth-form';
import { Car } from 'lucide-react';

export default function AuthPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'auth-hero');

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl md:grid md:grid-cols-2">
        <div className="relative hidden h-full md:block">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={800}
              height={1200}
              className="h-full w-full object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="font-headline text-4xl font-bold">SmartPark</h1>
            <p className="mt-2 max-w-sm text-lg">The future of urban parking. Seamless, secure, and smart.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center bg-card p-8 md:p-12">
            <div className="flex items-center gap-2 self-start text-primary mb-6">
                <Car className="h-8 w-8" />
                <span className="font-headline text-2xl font-bold">SmartPark</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">
                Sign in or create an account to get started.
            </p>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
