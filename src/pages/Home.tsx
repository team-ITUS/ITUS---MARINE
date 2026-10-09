import '@/styles/home.css'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import BrandStatement from '@/components/sections/home/BrandStatement'
import BuildTimeline from '@/components/sections/home/BuildTimeline'
import CapabilityPreview from '@/components/sections/home/CapabilityPreview'
import FinalCta from '@/components/sections/home/FinalCta'
import HomeHero from '@/components/sections/home/HomeHero'
import IndustryWall from '@/components/sections/home/IndustryWall'
import Lifecycle from '@/components/sections/home/Lifecycle'
import Metrics from '@/components/sections/home/Metrics'
import PriorityPlatforms from '@/components/sections/home/PriorityPlatforms'
import RangePreview from '@/components/sections/home/RangePreview'
import { orderedVessels as vessels } from '@/data/vessels'

export default function Home() {
  const hero = vessels.find((vessel) => vessel.heroFeatured)!
  return (
    <MainLayout>
      <Seo
        title="ITUS Marine | Shipyard & Vessel Engineering"
        description="ITUS Marine provides vessel manufacturing, marine engineering, systems integration and lifecycle support across professional, commercial, rescue and leisure marine applications."
      />
      <div className="home-page">
        <HomeHero vessel={hero} />
        <BrandStatement />
        <Metrics />
        <PriorityPlatforms />
        <RangePreview />
        <BuildTimeline />
        <CapabilityPreview />
        <IndustryWall />
        <Lifecycle />
        <FinalCta />
      </div>
    </MainLayout>
  )
}
