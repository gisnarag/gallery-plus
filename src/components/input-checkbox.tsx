import React from "react";
import Icon from "./icon";
import CheckIcon from "../assets/icons/check.svg?react";
import { type VariantProps, tv } from 'tailwind-variants';

export const inputCheckboxWrapperVariants = tv({
    base: `
    inline-flex items-center justify-center relative group
    `,
    variants: {
        disabled: {
            true: "pointer-events-none opacity-80"
        },
    }
});

// peer → reage a um irmão. group → reage a um pai
export const InputCheckboxVariants = tv({
    base: `
    appearance-none peer flex items-center justify-center 
    cursor-pointer transition overflow-hidden
    `,
    variants: {
        variant: {
            default: `
            border-2 border-solid
            border-border-primary hover:border-border-active
            checked:border-accent-brand checked:bg-accent-brand
            group-hover:checked:checked:border-accent-brand-light
            group-hover:checked:checked:bg-accent-brand-light
            `
        },
        size: {
            sm: "w-3 h-3 rounded-sm",
            md: "w-5 h-5 rounded-sm"
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    }
});

// InputCheckboxVariants é o irmão do checkIcon por isso quando o peer estiver checado, ele vai aparecer com o display block
export const InputCheckboxIconVariants = tv({
    base: `
    absolute top-1/2 -translate-y-1/2
    hidden peer-checked:block fill-white
    cursor-pointer    
    `,
    variants: {
        size: {
            sm: "w-3 h-3 left-px",
            md: "w-4 h-4 left-0.5"
        }
    },
    defaultVariants: {
        size: "md"
    }
});

interface InputCheckboxProps extends VariantProps<typeof InputCheckboxVariants>, Omit<React.ComponentProps<"input">, "size"> { }

export default function InputCheckbox({ variant, size, disabled, className, ...props }: InputCheckboxProps) {
    return (
        <label className={inputCheckboxWrapperVariants({ className, disabled })}>
            <input type="checkbox" className={InputCheckboxVariants({ variant, size })} {...props} />
            <Icon svg={CheckIcon} className={InputCheckboxIconVariants({ size })} />
        </label>
    );
}