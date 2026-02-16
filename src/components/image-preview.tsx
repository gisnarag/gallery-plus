import React from 'react';
import { tv } from 'tailwind-variants';

export const ImagePreviewVariants = tv({
    base: `rounded-lg overflow-hidden`
});

export const ImagePreviewImageVariants = tv({
    base: `w-full h-full object-cover`
})

interface ImagePreviewProps extends React.ComponentProps<"img"> {
    imageClassName?: string;
}

// Exibir a imagem selecionada na tela 
export default function ImagePreview({ imageClassName, className, ...props }: ImagePreviewProps) {
    return (
        <div className={ImagePreviewVariants({ className })}>
            <img className={ImagePreviewImageVariants({ className: imageClassName })} {...props} />
        </div>
    );
}
