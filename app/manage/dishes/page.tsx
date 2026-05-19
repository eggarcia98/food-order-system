"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthSession } from "@/lib/useAuthSession";
import type { MenuItem } from "@/lib/domain";
import CrudDishCard from "@/components/manage/dishes/ManagementDishCard";



export default function DishManagementPage() {
  const { isAuthenticated, isSessionLoading } = useAuthSession();
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDish, setShowAddDish] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");


  const [dishFormData, setDishFormData] = useState({
    name: "",
    description: "",
  });


  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const [dishesResponse] = await Promise.all([
        fetch("/api/menu_items"),
      ]);


      if (!dishesResponse.ok) throw new Error("Failed to fetch dishes");

      const dishesData = await dishesResponse.json();
      setDishes(dishesData);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dishes");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const categoryPages = useMemo(() => {
    return dishes
      .slice()
      .sort((left, right) => {
        if (left.category_id !== right.category_id) {
          return left.category_id - right.category_id;
        }

        return left.name.localeCompare(right.name);
      })
      .reduce<Array<{ id: number; label: string; itemCount: number }>>((pages, dish) => {
        const existing = pages.find((page) => page.id === dish.category_id);
        if (existing) {
          existing.itemCount += 1;
          return pages;
        }

        pages.push({
          id: dish.category_id,
          label: `Category ${dish.category_id}`,
          itemCount: 1,
        });
        return pages;
      }, []);
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return dishes
      .filter((dish) => {
        const matchesQuery =
          query.length === 0 || dish.name.toLowerCase().includes(query);
        const matchesCategory =
          activeCategory === "all" || dish.category_id === activeCategory;

        return matchesQuery && matchesCategory;
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [activeCategory, dishes, searchQuery]);

  // CREATE: Add new dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!dishFormData.name.trim()) {
    //   setError("Dish name is required");
    //   return;
    // }

    try {
      const res = await fetch("/api/menu_items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dishFormData.name,
          description: dishFormData.description,
          is_active: true,
        }),
        credentials: "include",
      });

      if (res.status === 401) throw new Error("Session expired");
      if (!res.ok) throw new Error("Failed to create dish");

      showSuccess("Dish created successfully!");
      setDishFormData({ name: "", description: "" });
      setShowAddDish(false);
      setError(null);
      fetchMenuData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create dish");
    }
  };

  // UPDATE: Edit dish


  // UPDATE: Toggle dish status
  const handleToggleDish = async (id: number, isActive: boolean) => {
    try {
      const res = await fetch(`/api/menu_items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update dish");

      showSuccess(`Dish ${!isActive ? "enabled" : "disabled"}`);
      setError(null);
      fetchMenuData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update dish");
    }
  };





  // UPDATE: Toggle variant status
  const handleToggleVariant = async (variantId: number, isActive: boolean) => {
    try {
      const res = await fetch(`/api/menu_items/variants/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update variant");

      showSuccess(`Variant ${!isActive ? "enabled" : "disabled"}`);
      setError(null);
      fetchMenuData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update variant");
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6 bg-background">
        <object
          data="/loading-icon.svg"
          type="image/svg+xml"
          className="h-12 w-12 mx-auto"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6 bg-background">
        <div className="border-3 border-brand rounded-md px-8 py-8 bg-cream shadow-lg">
          <h1 className="text-2xl font-extrabold tracking-wider font-bungee text-foreground mb-4">
            Access Denied
          </h1>
          <p className="text-light mb-6">
            You must be logged in to manage dishes.
          </p>
          <a
            href="/login"
            className="inline-block btn-brand-blue px-6 py-2 rounded-lg font-medium"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-[linear-gradient(180deg,#fbf8f3_0%,#fffdf8_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-white/80 p-6 shadow-[0_18px_60px_rgba(31,26,23,0.08)] ring-1 ring-black/5 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue/70">
                Menu administration
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-bungee">
                Manage Dishes
              </h1>
              <p className="text-sm leading-6 text-light">
                Search by dish name, switch between category pages, and keep the menu tidy without the heavy borders.
              </p>
            </div>
            <button
              onClick={() => {
                setShowAddDish(!showAddDish);
                setDishFormData({ name: "", description: "" });
              }}
              className="inline-flex items-center justify-center rounded-full bg-brand-blue px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
            >
              {showAddDish ? "Cancel" : "Create Dish"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="rounded-2xl bg-[#faf7f2] px-4 py-3 ring-1 ring-black/5">
              <label htmlFor="dish-search" className="mb-2 block text-sm font-medium text-foreground">
                Search dishes
              </label>
              <input
                id="dish-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by dish name"
                className="input-brand w-full rounded-2xl border-0 bg-white/90 px-4 py-3 shadow-sm outline-none ring-1 ring-black/5 transition placeholder:text-text-light focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>
            <div className="rounded-2xl bg-[#faf7f2] px-4 py-3 ring-1 ring-black/5">
              <p className="text-sm font-medium text-foreground">Results</p>
              <p className="mt-1 text-2xl font-semibold text-brand-blue">{filteredDishes.length}</p>
              <p className="text-xs text-text-light">of {dishes.length} dishes shown</p>
            </div>
          </div>

          <div className="lg:hidden flex mt-6 gap-3 overflow-x-auto pb-1 ">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === "all"
                ? "bg-brand-blue text-white shadow-sm"
                : "bg-white text-foreground ring-1 ring-black/5 hover:bg-[#f6f1eb]"
                }`}
            >
              All
            </button>
            {categoryPages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setActiveCategory(page.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === page.id
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-white text-foreground ring-1 ring-black/5 hover:bg-[#f6f1eb]"
                  }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </section>

        {/* Alerts */}
        {error && (
          <div className="rounded-2xl bg-[#fff5f5] px-4 py-3 text-brand-red ring-1 ring-brand-red/10">
            <p className="font-medium">{error}</p>
          </div>
        )}
        {successMsg && (
          <div className="rounded-2xl bg-[#f5f8ff] px-4 py-3 text-brand-blue ring-1 ring-brand-blue/10">
            <p className="font-medium">{successMsg}</p>
          </div>
        )}


        {/* READ: Dishes List */}
        {loading ? (
          <div className="rounded-3xl bg-white/70 py-12 text-center shadow-[0_18px_60px_rgba(31,26,23,0.06)] ring-1 ring-black/5">
            <p className="text-light">Loading dishes...</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="rounded-3xl bg-white/70 py-12 text-center shadow-[0_18px_60px_rgba(31,26,23,0.06)] ring-1 ring-black/5">
            <p className="text-light">No dishes match your search or category filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] ">
            <aside className="rounded-3xl bg-white/80 p-5 shadow-[0_18px_60px_rgba(31,26,23,0.06)] ring-1 ring-black/5 lg:sticky lg:top-6 lg:self-start hidden lg:block ">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-light">Category</h2>
                <span className="rounded-full bg-[#f7f3ee] px-2.5 py-1 text-xs text-text-light">{categoryPages.length}</span>
              </div>
              <div className="mt-4 space-y-2 ">
                {categoryPages.length > 0 ? (
                  categoryPages.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setActiveCategory(page.id)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${activeCategory === page.id
                        ? "bg-brand-blue text-white shadow-sm"
                        : "bg-[#faf7f2] text-foreground hover:bg-[#f4ede4]"
                        }`}
                    >
                      <span className="font-medium">{page.label}</span>
                      <span className={`text-xs ${activeCategory === page.id ? "text-white/80" : "text-text-light"}`}>
                        {page.itemCount}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-text-light">No category pages available yet.</p>
                )}
              </div>
            </aside>

            <div className="grid gap-6">
              {filteredDishes.map((dish) => (
                <CrudDishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
