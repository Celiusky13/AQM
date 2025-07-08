
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Eye } from 'lucide-react';

const ContentSection = () => {
  const content = [
    {
      id: 1,
      title: "Red, White & Royal Blue",
      type: "Película",
      year: "2023",
      rating: 4.8,
      views: "2.3M",
      description: "Romance entre el hijo del presidente y el príncipe británico",
      image: "🎬",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "Heartstopper",
      type: "Serie",
      year: "2022",
      rating: 4.9,
      views: "5.1M",
      description: "Dulce historia de amor adolescente y autodescubrimiento",
      image: "📺",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 3,
      title: "The Half of It",
      type: "Película",
      year: "2020",
      rating: 4.7,
      views: "1.8M",
      description: "Una nueva perspectiva del triángulo amoroso clásico",
      image: "🎭",
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 4,
      title: "Love, Victor",
      type: "Serie",
      year: "2020",
      description: "El viaje de autodescubrimiento de un adolescente latino",
      rating: 4.6,
      views: "3.2M",
      image: "💝",
      gradient: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      title: "Call Me By Your Name",
      type: "Película",
      year: "2017",
      rating: 4.8,
      views: "4.5M",
      description: "Romance veraniego en la Italia de los años 80",
      image: "🍑",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      id: 6,
      title: "Pose",
      type: "Serie",
      year: "2018",
      rating: 4.9,
      views: "2.7M",
      description: "La cultura ballroom y LGBTQ+ en el Nueva York de los 80",
      image: "💃",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="pride-text">Películas & Series</span> 🎬
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Contenido LGBTQ+ que nos inspira, emociona y representa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <Card key={item.id} className="group hover-lift overflow-hidden border-0 shadow-lg">
              <div className={`h-32 bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}>
                <div className="text-4xl">{item.image}</div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-pride-purple transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.year}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-pride-subtle p-6 rounded-2xl">
            <span className="text-2xl">🏳️‍⚧️</span>
            <div className="text-left">
              <h3 className="font-bold text-lg mb-1">¿Conoces más contenido increíble?</h3>
              <p className="text-gray-600">Compártelo con la comunidad y descubramos juntes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
