import Image from "next/image";

interface IconProps {
    src: string;
    alt?: string;
    className?: string;
}

export function Icon({ src, alt = "icon", className = "" }: IconProps) {
    return (
        <Image
            src={src}
            width={24}
            height={24}
            alt={alt}
            className={className}
            style={{ width: 24, height: 24 }} // Forzar ambas dimensiones
        />
    );
} 