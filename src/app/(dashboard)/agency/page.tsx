"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Copy, KeyRound, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RoleGuard } from "@/components/shared/role-guard";
import { canAccessAgency } from "@/lib/auth/roles";
import { createApiKeySchema, createClientSchema, type CreateApiKeyInput, type CreateClientInput } from "@/lib/validation/agency";
import {
  useAgencyApiKeys,
  useAgencyBrandSettings,
  useAgencyClients,
  useCreateAgencyClient,
  useCreateApiKey,
  useRevokeApiKey,
  useUpdateBrandSettings,
} from "@/lib/hooks/use-agency";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AgencyPage() {
  return (
    <RoleGuard allow={canAccessAgency}>
      <AgencyContent />
    </RoleGuard>
  );
}

function AgencyContent() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Agency</h1>
        <p className="text-sm text-ink-muted">Manage client organizations, white-label branding, and API access.</p>
      </div>

      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="branding">White-label</TabsTrigger>
          <TabsTrigger value="api-keys">API keys</TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          <ClientsTab />
        </TabsContent>
        <TabsContent value="branding">
          <BrandingTab />
        </TabsContent>
        <TabsContent value="api-keys">
          <ApiKeysTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClientsTab() {
  const { data: clients, isLoading } = useAgencyClients();
  const [open, setOpen] = useState(false);
  const createClient = useCreateAgencyClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientInput>({ resolver: zodResolver(createClientSchema) });

  const onSubmit = (values: CreateClientInput) => {
    createClient.mutate(values, { onSuccess: () => { reset(); setOpen(false); } });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Onboard client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Onboard a new client</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="name">Client name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-critical">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ownerEmail">Owner email</Label>
                <Input id="ownerEmail" type="email" {...register("ownerEmail")} />
                {errors.ownerEmail && <p className="text-sm text-critical">{errors.ownerEmail.message}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createClient.isPending}>
                  {createClient.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Onboard
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : !clients || clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Building2 className="h-10 w-10 text-ink-faint" />
            <p className="text-sm text-ink-muted">No clients yet. Onboard one to manage their accessibility reporting.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-5">
                <p className="font-medium text-ink">{client.name}</p>
                <p className="text-xs text-ink-faint">{client._count.websites} websites · {client._count.users} users</p>
                <p className="mt-1 text-xs text-ink-faint">Onboarded {formatDate(client.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function BrandingTab() {
  const { data: settings, isLoading } = useAgencyBrandSettings();
  const updateSettings = useUpdateBrandSettings();
  const { register, handleSubmit } = useForm({
    values: {
      brandName: settings?.brandName ?? "",
      logoUrl: settings?.logoUrl ?? "",
      primaryColor: settings?.primaryColor ?? "",
      supportEmail: settings?.supportEmail ?? "",
      customDomain: settings?.customDomain ?? "",
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>White-label settings</CardTitle>
        <CardDescription>Applied to reports and client-facing pages generated on your clients&apos; behalf.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit((values) => updateSettings.mutate(values))}>
          <div className="space-y-1.5">
            <Label htmlFor="brandName">Brand name</Label>
            <Input id="brandName" {...register("brandName")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" {...register("logoUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="primaryColor">Primary color</Label>
            <Input id="primaryColor" placeholder="#2A4CDB" {...register("primaryColor")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="supportEmail">Support email</Label>
            <Input id="supportEmail" type="email" {...register("supportEmail")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="customDomain">Custom domain</Label>
            <Input id="customDomain" placeholder="reports.youragency.com" {...register("customDomain")} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ApiKeysTab() {
  const { data: keys, isLoading } = useAgencyApiKeys();
  const createKey = useCreateApiKey();
  const revokeKey = useRevokeApiKey();
  const [open, setOpen] = useState(false);
  const [issuedKey, setIssuedKey] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateApiKeyInput>({ resolver: zodResolver(createApiKeySchema) });

  const onSubmit = (values: CreateApiKeyInput) => {
    createKey.mutate(values.name, {
      onSuccess: (data) => {
        setIssuedKey(data.apiKey);
        reset();
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setIssuedKey(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Create API key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{issuedKey ? "Save your API key" : "Create an API key"}</DialogTitle>
            </DialogHeader>
            {issuedKey ? (
              <div className="space-y-3">
                <p className="text-sm text-ink-muted">This is the only time you&apos;ll see this key. Store it securely.</p>
                <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface-raised px-3 py-2 font-mono text-xs">
                  <span className="flex-1 truncate">{issuedKey}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy"
                    onClick={() => {
                      navigator.clipboard.writeText(issuedKey);
                      toast.success("Copied to clipboard.");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Key name</Label>
                  <Input id="name" placeholder="Production integration" {...register("name")} />
                  {errors.name && <p className="text-sm text-critical">{errors.name.message}</p>}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createKey.isPending}>
                    {createKey.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Generate key
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : !keys || keys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <KeyRound className="h-10 w-10 text-ink-faint" />
            <p className="text-sm text-ink-muted">No API keys yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="divide-y divide-border overflow-hidden p-0">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{key.name}</p>
                <p className="font-mono text-xs text-ink-faint">{key.keyPrefix}••••••••</p>
              </div>
              <div className="flex items-center gap-3">
                {key.revokedAt ? (
                  <Badge variant="outline">Revoked</Badge>
                ) : (
                  <Button variant="ghost" size="icon" aria-label="Revoke key" onClick={() => revokeKey.mutate(key.id)}>
                    <Trash2 className="h-4 w-4 text-critical" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

