import api from "@/lib/api/api";

export const handleDownloadFile = async (id: number, filename: string) => {
  try {
    const res = await api.get(`/attachments/getSignedUrl/${id}`, {
      withCredentials: true,
    });

    const { url } = res.data;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // make sure this includes the extension like "monkey.jpg"
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Download failed", err);
  }
};
