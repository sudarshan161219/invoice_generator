import api from "@/lib/api/api";

export async function uploadClientAvatar(clientId: number, file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post(`/clients/avatar/${clientId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}
