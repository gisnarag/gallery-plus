import React from 'react';
import { type VariantProps, tv } from 'tailwind-variants';
import Icon from "./icon";
import Text from "./text";

export const inputTextContainerVariants = tv({
    base: "flex flex-col gap-1"
});

export const inputTextWrapperVariants = tv({
    base: `
        border border-solid border-border-primary
        focus:border-border-active bg-transparent
        rounded flex items-center gap-3
    `,
    variants: {
        size: {
            md: "h-10 p-3"
        },
        disabled: {
            true: "pointer-events-none"
        }
    },
    defaultVariants: {
        size: "md",
        disabled: false
    }
});

export const InputTextVariants = tv({
    base: `
    bg-transparent outline-none placeholder:text-placeholder
    text-accent-paragraph flex-1
    `
});

export const inputTextIconVariants = tv({
    base: "fill-placeholder",
    variants: {
        size: {
            md: "w-6 h-6"
        }
    },
    defaultVariants: {
        size: "md"
    }
});

// Meu componente InputText aceita as variants do Tailwind Variants, todas as props de um <input> normal, MENOS size e disabled. Omit<T, K> Pegue tudo de T, menos K
// React.ReactNode é qualquer coisa que o React consegue renderizar. Ou seja, não representa o estado (como boolean), representa o conteúdo do erro. 
// Ex: se error existe: input fica vermelho. 
// boolean → lógica interna, ReactNode → o que aparece na tela (qualquer coisa renderizável)
interface InputTextProps extends VariantProps<typeof inputTextWrapperVariants>, Omit<React.ComponentProps<"input">, "size" | "disabled"> {
    icon?: React.ComponentProps<typeof Icon>["svg"];
    error?: React.ReactNode;
}

// Operador && (AND):
// Se o primeiro valor for truthy, o segundo é avaliado/renderizado.
// Se o primeiro for falsy, nada é renderizado.

// Dicas de uso -> 
// && quando: Você só quer renderizar se existir, se tiver erro, mostra o erro. Se não acontecer nada, tudo bem?”

// Use operador ternário ? : quando: Você tem duas opções claras. Se tiver erro, mostra isso, senão mostra aquilo.

// Com Tailwind Variants é possível uma função receber className e CONCATENAR com as classes base/variants semelhante ao cx do cva. Ex: {inputTextContainerVariants({ className })}, inputTextContainerVariants é uma função que gera classes base + variants e aceita um className extra. No final, tudo vira uma string só
export default function InputText({ size, disabled, className, icon, error, ...props }: InputTextProps) {

    return (
        <div className={inputTextContainerVariants({ className })}>
            <div className={inputTextWrapperVariants({ size, disabled })}>
                {icon && <Icon svg={icon} className={inputTextIconVariants({ size })} />}
                <input className={InputTextVariants()} disabled={disabled as boolean} {...props} />
            </div>
            {error && <Text variant="label-small" className="text-accent-red">
                {error}
            </Text>}
        </div>
    );
}
