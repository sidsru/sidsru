import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Overview from '@/components/Overview'
import Systems from '@/components/Systems'
import DeepDive from '@/components/DeepDive'
import Optimization from '@/components/Optimization'
import Problems from '@/components/Problems'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <Overview />
      <Systems />
      <DeepDive />
      <Optimization />
      <Problems />
      <Contact />
    </main>
  )
}