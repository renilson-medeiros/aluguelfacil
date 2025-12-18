"use client";

import ReceiptForm from "@/modules/dashboard/ReceiptForm";

import { Suspense } from 'react';

export default function NewReceiptPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ReceiptForm />
        </Suspense>
    );
}
