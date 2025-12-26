import type { CustomerPostRequest } from "~/models/customer/request/customer_post_req";
import type { CustomerGetResponse } from "~/models/customer/response/customer_get_res";
import type { CustomerPostResponse } from "~/models/customer/response/customer_post_res";

export function useCustomer() {
  // Get api instance from plugin
  const { $api } = useNuxtApp();

  const createCustomer = async (customer: CustomerPostRequest) => {
    const response = await $api.post<CustomerPostResponse>(
      "/customers",
      customer
    );

    return response.data;
  };
  const deleteCustomer = async (idx: number) => {
    const response = await $api.delete<CustomerPostResponse>(
      `/customers/${idx}`
    );
    return response.data;
  };
  const getCustomerById = async (idx: number) => {
    const response = await $api.get<CustomerGetResponse>(`/customers/${idx}`);
    return response.data;
  };

  const updateCustomer = async (idx: number, customer: CustomerPostRequest) => {
    const response = await $api.put<CustomerPostResponse>(
      `/customers/${idx}`,
      customer
    );
    return response.data;
  };
  // Export functions
  return {
    deleteCustomer,
    createCustomer,
    getCustomerById,
    updateCustomer,
  };
}
