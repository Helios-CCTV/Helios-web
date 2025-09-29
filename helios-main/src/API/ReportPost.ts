import axios from "axios";

const CCTV_API_BASE_URL = import.meta.env.VITE_CCTV_API_URL;

export interface ReportPostRequest {
  damageType: string;
  location: string;
  severity: number | string;
  description?: string;
  photo?: File | null;
  name?: string;
  contact?: string;
  isChecked: boolean;
}

const api = axios.create({
  baseURL: CCTV_API_BASE_URL,
  timeout: 5000,
});

export async function postReport(payload: ReportPostRequest) {
  const form = new FormData();

  form.append("damageType", payload.damageType);
  form.append("location", payload.location);
  form.append("severity", String(payload.severity));
  form.append("description", payload.description ?? "");
  form.append("name", payload.name ?? "");
  form.append("contact", payload.contact ?? "");
  form.append("isChecked", String(payload.isChecked ?? false));

  if (payload.photo) {
    const fileName = (payload.photo as File).name || "report.jpg";
    form.append("photo", payload.photo, fileName);
  }

  try {
    const response = await api.post("report/save", form);

    return response.data;
  } catch (error) {
    console.error("Error posting report:", error);
    throw error;
  }
}
