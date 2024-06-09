import html2canvas from "html2canvas";
import SuccessToast from "../components/Toast/SuccessToast";
import ErrorToast from "../components/Toast/ErrorToast";
import { api } from "../Https";

export function convertStatus(status) {
  // 0 : on-going, 1 : assigned, 2: recieved, 3: delivered, 4 : complete, 5: canceled
  switch (status) {
    case 0:
      return "ordered";
    case 1:
      return "assigned";
    case 2:
      return "picked up";
    case 3:
      return "delivered";
    case 4:
      return "approved";
    case 5:
      return "canceled";
    default:
      return "unknown";
  }
}

export function convertFuel(fuel_type) {
  switch (fuel_type) {
    case 0:
      return "91";
    case 1:
      return "95";
    case 2:
      return "D";
    default:
      return "unknown";
  }
}

// start

export const captureComponent = (componentId, Email, companyId) => {
  const componentElement = document.getElementById(componentId);
  html2canvas(componentElement)
    .then((canvas) => {
      // Convert the canvas to a Blob

      canvas.toBlob(async (blob) => {
        // Send the Blob to the server
        const ImageFile = new File([blob], "report.png", { type: "image/png" });
        await sendImageToServer(ImageFile, Email, companyId);
      }, "image/png");
    })
    .catch((error) => console.log(error));
};

const sendImageToServer = async (ImageFile, Email, companyId) => {
  const formData = new FormData();
  formData.append("attachment", ImageFile);
  formData.append("email", Email);
  formData.append("companyId", companyId);
  try {
    await api.post("/company/send-report", formData);
    SuccessToast("Report send! Check your email inbox!");
  } catch (error) {
    console.error("Error:", error);
    ErrorToast("Error caused while sending the report!");
  }
};

// end
