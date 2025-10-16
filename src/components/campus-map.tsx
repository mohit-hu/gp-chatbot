import { Map, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { campusLocations } from '@/lib/data';
import { Button } from './ui/button';

export default function CampusMap() {
  const getImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Map className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold font-headline text-primary">Campus Navigation</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {campusLocations.map((location) => {
          const image = getImage(location.id);
          return (
            <Card key={location.id} className="overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                {image && (
                   <Image
                      src={image.imageUrl}
                      alt={image.description}
                      data-ai-hint={image.imageHint}
                      width={400}
                      height={300}
                      className="object-cover aspect-video w-full transition-transform group-hover:scale-105"
                    />
                )}
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-md flex items-center justify-center text-center">
                  <MapPin className="h-4 w-4 mr-2 shrink-0" />
                  {location.name}
                </CardTitle>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">View the full campus on Google Maps.</p>
            <a href="https://www.google.com/maps?q=Government+Polytechnic+Srinagar+Garhwal" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Open Campus Map <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </Button>
            </a>
        </CardContent>
      </Card>
    </div>
  );
}

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" x2="21" y1="14" y2="3" />
      </svg>
    )
  }
