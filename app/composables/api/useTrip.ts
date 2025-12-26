import type { TripGetResponse } from "~/models/trip/trip_get_res";

export function useTrips() {
  // Get api instance from plugin
  const { $api } = useNuxtApp();

  // Get all trips from API
  const getAllTrips = async () => {
    const response = await $api.get<TripGetResponse[]>("/trips");
    return response.data;
  };
  // Export functions
  const getTrip = async (idx: number) => {
    const response = await $api.get<TripGetResponse>(`/trips/${idx}`);
    return response.data;
  };
  // Export functions
  return {
    getAllTrips,
    getTrip,
  };
}
