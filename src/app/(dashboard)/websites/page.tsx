"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2, Plus, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createWebsiteSchema, type CreateWebsiteInput, startScanSchema, type StartScanInput } from "@/lib/validation/websites";
import { useCreateWebsite, useStartWebsiteScan, useWebsites } from "@/lib/hooks/use-websites";
import { formatDate } from "@/lib/utils";
import type { Website } from "@/types/models";

export default function WebsitesPage() {
  const { data: websites, isLoading } = useWebsites();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Websites</h1>
          <p className="text-sm text-ink-muted">Add the sites you want Accewa to monitor for accessibility issues.</p>
        </div>
        <AddWebsiteDialog />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : !websites || websites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Globe className="h-10 w-10 text-ink-faint" />
            <div>
              <p className="font-medium text-ink">No websites yet</p>
              <p className="text-sm text-ink-muted">Add your first website to start scanning it against WCAG.</p>
            </div>
            <AddWebsiteDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {websites.map((site) => (
            <WebsiteCard key={site.id} website={site} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddWebsiteDialog() {
  const [open, setOpen] = useState(false);
  const createWebsite = useCreateWebsite();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWebsiteInput>({ resolver: zodResolver(createWebsiteSchema) });

  const onSubmit = (values: CreateWebsiteInput) => {
    createWebsite.mutate(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Add website
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a website</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Marketing site" {...register("name")} />
            {errors.name && <p className="text-sm text-critical">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="url">URL</Label>
            <Input id="url" placeholder="https://example.com" {...register("url")} />
            {errors.url && <p className="text-sm text-critical">{errors.url.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createWebsite.isPending}>
              {createWebsite.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add website
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WebsiteCard({ website }: { website: Website }) {
  const [scanOpen, setScanOpen] = useState(false);
  const startScan = useStartWebsiteScan();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StartScanInput>({ resolver: zodResolver(startScanSchema), defaultValues: { url: website.url } });

  const onSubmit = (values: StartScanInput) => {
    startScan.mutate(
      { websiteId: website.id, url: values.url },
      {
        onSuccess: () => {
          reset();
          setScanOpen(false);
        },
      }
    );
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{website.name}</p>
            <Link href={website.url} target="_blank" className="truncate text-sm text-brand hover:underline block">
              {website.url}
            </Link>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${website.isActive ? "bg-success-tint text-success" : "bg-surface-raised text-ink-faint"}`}>
            {website.isActive ? "Active" : "Paused"}
          </span>
        </div>
        <p className="text-xs text-ink-faint">Added {formatDate(website.createdAt)}</p>
        <Dialog open={scanOpen} onOpenChange={setScanOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <ScanSearch className="h-4 w-4" /> Run scan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan {website.name}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-1.5">
                <Label htmlFor={`url-${website.id}`}>URL to scan</Label>
                <Input id={`url-${website.id}`} {...register("url")} />
                {errors.url && <p className="text-sm text-critical">{errors.url.message}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={startScan.isPending}>
                  {startScan.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Start scan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

