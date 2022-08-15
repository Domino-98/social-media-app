import axios from "axios";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      download: (url: string) => {
        axios({
          url: url,
          method: "GET",
          responseType: "blob",
        }).then((response) => {
          const index = url.lastIndexOf("/") + 1;
          const fileName = url.substring(index);
          const fileURL = window.URL.createObjectURL(new Blob([response.data]));
          const fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", fileName);
          document.body.appendChild(fileLink);
          fileLink.click();
        });
      },
    },
  };
});
