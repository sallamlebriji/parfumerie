import { MessageCircle } from "lucide-react";
import LuxuryButton from "./LuxuryButton";

const WhatsAppButton = ({ children = "Commander via WhatsApp", href, className = "" }) => (
  <LuxuryButton as="a" variant="whatsapp" href={href} target="_blank" rel="noreferrer" className={className}>
    <MessageCircle size={18} /> {children}
  </LuxuryButton>
);

export default WhatsAppButton;
