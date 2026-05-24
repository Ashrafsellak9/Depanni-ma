"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequestPayout } from "@/hooks/artisan/useArtisanEarnings";
import { getApiErrorMessage } from "@/lib/api";

interface PayoutRequestProps {
  balance: number;
}

export function PayoutRequest({ balance }: PayoutRequestProps) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const requestPayout = useRequestPayout();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error("Montant invalide");
      return;
    }
    if (num > balance) {
      toast.error("Montant supérieur au solde");
      return;
    }
    try {
      await requestPayout.mutateAsync({
        amount: num,
        bankName: bankName.trim(),
        iban: iban.trim(),
      });
      toast.success("Demande de virement envoyée");
      setAmount("");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Demande de virement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Solde disponible : <span className="font-semibold text-navy">{balance} MAD</span>
          </p>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (MAD)</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              max={balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(balance)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankName">Banque</Label>
            <Input
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Attijariwafa bank"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iban">RIB / IBAN</Label>
            <Input
              id="iban"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="MA..."
            />
          </div>
          <Button type="submit" disabled={requestPayout.isPending || balance <= 0}>
            Demander le virement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
