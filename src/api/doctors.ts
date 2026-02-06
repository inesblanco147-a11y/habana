import { authAxios } from "./config";
import { ExternalDoctor, ExternalDoctorsResponse } from "@/types/externalDoctor";

export const get_doctors = async ({ pageParam = 1 }): Promise<ExternalDoctorsResponse> => {
  const response = await authAxios.get(`/equipo/doctors/?page=${pageParam}&pages=9`);
  return response.data;
};

export const post_doctor = async (data: Omit<ExternalDoctor, "id">) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("title", data.title);
  formData.append("specialty", data.specialty);
  formData.append("summary", data.summary);
  formData.append("experience", data.experience);
  formData.append("education", JSON.stringify(data.education));
  formData.append("certifications", JSON.stringify(data.certifications));
  if (data.image) {
    formData.append("image", data.image);
  }
  const response = await authAxios.post("/equipo/doctors/", formData);
  return response.data;
};

export const update_doctor = async (id: number, data: Partial<ExternalDoctor>) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.title) formData.append("title", data.title);
  if (data.specialty) formData.append("specialty", data.specialty);
  if (data.summary) formData.append("summary", data.summary);
  if (data.experience) formData.append("experience", data.experience);
  if (data.education) formData.append("education", JSON.stringify(data.education));
  if (data.certifications) formData.append("certifications", JSON.stringify(data.certifications));
  if (data.image) {
    formData.append("image", data.image);
  }
  const response = await authAxios.put(`/equipo/doctors/${id}/`, formData);
  return response.data;
};

export const delete_doctor = async (id: number) => {
  await authAxios.delete(`/equipo/doctors/${id}/`);
};
