"use client";

import { EarningsChart } from "@/app/(artisan)/artisan/earnings/components/EarningsChart";
import { PayoutRequest } from "@/app/(artisan)/artisan/earnings/components/PayoutRequest";
import { TransactionHistory } from "@/app/(artisan)/artisan/earnings/components/TransactionHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtisanEarnings } from "@/hooks/artisan/useArtisanEarnings";

export default function ArtisanEarningsPage() {
  const { data, isLoading } = useArtisanEarnings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">Revenus</h1>
        <p className="text-muted-foreground">Wallet, commissions et virements</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Solde wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-success">
                  {data?.wallet.balance ?? 0} MAD
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total crédité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-navy">
                  {data?.summary.totalCredited ?? 0} MAD
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Commissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-danger">
                  {data?.summary.totalCommissions ?? 0} MAD
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenus — 30 derniers jours</CardTitle>
        </CardHeader>
        <CardContent>
          <EarningsChart data={data?.chart} isLoading={isLoading} />
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-navy">Historique des transactions</h2>
          <TransactionHistory transactions={data?.transactions} isLoading={isLoading} />
        </div>
        <PayoutRequest balance={data?.wallet.balance ?? 0} />
      </div>
    </div>
  );
}
