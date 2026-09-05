import { ActivityStatList } from "@/components/ActivityStatList";
import { getActivitiesBetween } from "@/lib/strava/client";

interface PageProps {
  searchParams: Promise<{ year?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { year: yearParam } = await searchParams;
  const year = yearParam ? Number(yearParam) : new Date().getFullYear();

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

  const activities = await getActivitiesBetween(yearStart, yearEnd);

  return <ActivityStatList activities={activities} year={year} />;
};

export default Page;
