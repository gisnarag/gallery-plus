import * as DialogPrimitive from '@radix-ui/react-dialog';
import Card from './card';
import cn from 'classnames';
import Text from './text';
import ButtonIcon from './button-icon';
import XIcon from '../assets/icons/x.svg?react';
import Divider from './divider';

/* 
    O Radix não exporta um default -> DialogPrimitive from ... → não funciona. Ele exporta várias coisas nomeadas. DialogPrimitive = { Root, Trigger, Content, ...}

    O * significa Importe TUDO o que esse pacote exporta e coloque dentro de um objeto que chamei DialogPrimitive. É alias de import (renomear).

*/

// Encapsular o meu componente Dialog usado na API ao componente do Radix instalado
export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogClose = DialogPrimitive.Close;

/*
    Dialog
 ├── Root        ← controla o estado (open/close)
 ├── Trigger     ← botão que abre
 ├── Content     ← conteúdo do modal
 ├── Overlay     ← fundo escuro
 ├── Close       ← botão de fechar

*/

// Fundo com blur
export function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.DialogOverlay>) {

    return <DialogPrimitive.Overlay className={cn(`
    fixed inset-0 z-50 bg-background-secondary/60 backdrop-blur-sm
    data-[state=open]:animate-in
    data-[state=open]:fade-in-0
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
    `)} {...props} />
}

// DialogPrimitive.Portal usa React Portal para renderizar o conteúdo fora da hierarquia normal do DOM (geralmente direto no <body>)
export function DialogContent({ className, ref, children, ...props }: React.ComponentProps<typeof DialogPrimitive.DialogContent>) {
    return (
        <DialogPrimitive.Portal>
            <DialogOverlay />

            <DialogPrimitive.Content ref={ref} className={cn(`
                fixed left-[50%] top-[50%] w-full max-w-[32rem]
                z-[60] translate-x-[-50%] translate-y-[-50%]
                data-[state=open]:animate-in
                data-[state=open]:fade-in-0 
                data-[state=open]:slide-in-from-bottom-[48%]
                data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0
                data-[state=closed]:slide-out-to-bottom-[48%]
                `, className)} {...props}>
                <Card size="lg" variant="primary">
                    {children}
                </Card>
            </DialogPrimitive.Content>

        </DialogPrimitive.Portal>
    )
}

export function DialogHeader({ children, className, ...props }: React.ComponentProps<"div">) {
    return <>
        <header className={cn(`flex items-center justify-between`, className)} {...props}>
            <DialogPrimitive.Title>
                <Text variant="heading-medium" className="flex-1">{children}</Text>
            </DialogPrimitive.Title>

            <DialogClose asChild>
                <ButtonIcon icon={XIcon} variant="ghost"></ButtonIcon>
            </DialogClose>
        </header>
        <Divider className="mt-1.5 mb-5" />
    </>
}

export function DialogBody({ children, ...props }: React.ComponentProps<"div">) {
    return <div {...props}>
        {children}
    </div>
}

export function DialogFooter({ children, ...props }: React.ComponentProps<"div">) {
    return <div {...props}>
        <Divider className="mt-5 mb-1.5" />
        <footer className="flex items-center justify-end gap-3">
            {children}
        </footer>
    </div>
}

