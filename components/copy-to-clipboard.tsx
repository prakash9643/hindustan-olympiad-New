import { CopyCheck, CopyIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


export default function CopyToClipboard({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const { success } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        success("Copied to clipboard!", { duration: 2000, position: "top-right", description: `"${text}" has been copied to your clipboard.` });
        
    };

    return (
        <div className="flex items-center px-2">
            {!copied ? (
                <CopyIcon className="h-4 w-4 text-green-500 cursor-pointer" onClick={handleCopy} />
                ) : (
                    <CopyCheck className="h-4 w-4 text-muted-foreground" />
                )
            }
        </div>
    );
}