import { BarChart, LineChart } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-navy-700 text-white py-16 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<LineChart className="h-12 w-12 text-coral-500" />}
            title="Compare different locations"
            description="Easily compare population trends and statistics between multiple cities or countries. Visualize growth rates and demographic shifts over time."
          />
          <FeatureCard
            icon={<BarChart className="h-12 w-12 text-coral-500" />}
            title="Detailed demographic breakdowns"
            description="Access comprehensive demographic data including age distribution, gender ratios, and ethnic diversity for any selected location."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: {
  title: string;
  description: string;
  icon: React.ReactNode
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

