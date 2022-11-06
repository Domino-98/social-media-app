import { Pin } from "~~/models/pin";

export const usePins = () => {
  const pins = useState<Pin[]>("pins", () => []);
  const userPins = useState<Pin[]>("userPins", () => []);
  const savedPins = useState<Pin[]>("savedPins", () => []);
  const pin = useState<Pin | null>("pin", () => null);

  return {
    pins,
    userPins,
    savedPins,
    pin,
  };
};
