"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useAuthSession } from "@/lib/useAuthSession";
import type { MenuItem, ItemVariant } from "@/lib/domain";

interface EditingState {
  type: "none" | "dish" | "variant";
  dishId?: number;
  variantId?: number;
}

export default function DishManagementPage() {
  const { isAuthenticated, isSessionLoading } = useAuthSession();
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDish, setShowAddDish] = useState(false);
  const [editing, setEditing] = useState<EditingState>({ type: "none" });
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const dishNameInputId = useId();
  const dishDescriptionInputId = useId();
  const variantNameInputId = useId();
  const variantPriceInputId = useId();

  // Form states
  const [dishFormData, setDishFormData] = useState({
    name: "",
    description: "",
  });
  const [variantFormData, setVariantFormData] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    if (loading || activeCategory !== "all") return;

    const firstCategory = [...new Set(dishes.map((dish) => dish.category_id).filter((categoryId) => categoryId !== null && categoryId !== undefined))]
      .sort((left, right) => left - right)[0];

    if (typeof firstCategory === "number") {
      setActiveCategory(firstCategory);
    }
  }, [activeCategory, dishes, loading]);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/menu_items");
      if (!res.ok) throw new Error("Failed to fetch dishes");
      const data = await res.json();
      setDishes(data);
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
    const categories = new Map<number | null, MenuItem[]>();

    for (const dish of dishes) {
      const current = categories.get(dish.category_id) ?? [];
      current.push(dish);
      categories.set(dish.category_id, current);
    }

    return [...categories.entries()]
      .map(([categoryId, items]) => ({
        categoryId,
        label: categoryId === null ? "Uncategorized" : `Category ${categoryId}`,
        items: items.sort((left, right) => left.name.localeCompare(right.name)),
      }))
      .sort((left, right) => {
        if (left.categoryId === null) return 1;
        if (right.categoryId === null) return -1;
        return left.categoryId - right.categoryId;
      });
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
      .sort((left, right) => {
        const leftCategory = left.category_id ?? Number.MAX_SAFE_INTEGER;
        const rightCategory = right.category_id ?? Number.MAX_SAFE_INTEGER;

        if (leftCategory !== rightCategory) {
          return leftCategory - rightCategory;
        }

        return left.name.localeCompare(right.name);
      });
  }, [activeCategory, dishes, searchQuery]);

  // CREATE: Add new dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishFormData.name.trim()) {
      setError("Dish name is required");
      return;
    }

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
      fetchDishes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create dish");
    }
  };

  // UPDATE: Edit dish
  const handleUpdateDish = async (dishId: number) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return;

    if (!dishFormData.name.trim()) {
      setError("Dish name is required");
      return;
    }

    try {
      const res = await fetch(`/api/menu_items/${dishId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dishFormData.name,
          description: dishFormData.description,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update dish");

      showSuccess("Dish updated successfully!");
      setEditing({ type: "none" });
      setError(null);
      fetchDishes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update dish");
    }
  };

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
      fetchDishes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update dish");
    }
  };

  // CREATE: Add variant
  const handleCreateVariant = async (dishId: number) => {
    if (!variantFormData.name.trim() || !variantFormData.price.trim()) {
      setError("Variant name and price required");
      return;
    }

    try {
      const res = await fetch(`/api/menu_items/${dishId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_name: variantFormData.name,
          price: parseFloat(variantFormData.price),
          is_active: true,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create variant");

      showSuccess("Variant created!");
      setVariantFormData({ name: "", price: "" });
      setError(null);
      fetchDishes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create variant",
      );
    }
  };

  // UPDATE: Edit variant
  const handleUpdateVariant = async (variantId: number) => {
    if (!variantFormData.name.trim() || !variantFormData.price.trim()) {
      setError("Variant name and price required");
      return;
    }

    try {
      const res = await fetch(`/api/menu_items/variants/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_name: variantFormData.name,
          price: parseFloat(variantFormData.price),
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update variant");

      showSuccess("Variant updated!");
      setEditing({ type: "none" });
      setVariantFormData({ name: "", price: "" });
      setError(null);
      fetchDishes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update variant");
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
      fetchDishes();
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

          <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === "all"
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-white text-foreground ring-1 ring-black/5 hover:bg-[#f6f1eb]"
              }`}
            >
              All
            </button>
            {categoryPages.map((page) => (
              <button
                key={page.label}
                type="button"
                onClick={() => setActiveCategory(page.categoryId ?? "all")}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === page.categoryId
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

        {/* CREATE Form */}
        {showAddDish && (
          <div className="rounded-3xl bg-white/85 p-6 shadow-[0_18px_60px_rgba(31,26,23,0.08)] ring-1 ring-black/5">
            <h2 className="mb-4 text-xl font-bold font-bungee text-foreground">
              Create New Dish
            </h2>
            <form onSubmit={handleCreateDish} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor={dishNameInputId} className="block text-sm font-medium text-foreground">
                  Dish Name *
                </label>
                <input
                  id={dishNameInputId}
                  type="text"
                  value={dishFormData.name}
                  onChange={(e) =>
                    setDishFormData({ ...dishFormData, name: e.target.value })
                  }
                  placeholder="Enter dish name"
                  className="input-brand w-full rounded-2xl border-0 bg-[#faf7f2]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={dishDescriptionInputId} className="block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id={dishDescriptionInputId}
                  value={dishFormData.description}
                  onChange={(e) =>
                    setDishFormData({
                      ...dishFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter dish description"
                  rows={3}
                  className="input-brand w-full rounded-2xl border-0 bg-[#faf7f2]"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 inline-flex w-full items-center justify-center rounded-full bg-brand-blue py-3 font-medium text-white transition hover:opacity-95"
              >
                Create Dish
              </button>
            </form>
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
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-3xl bg-white/80 p-5 shadow-[0_18px_60px_rgba(31,26,23,0.06)] ring-1 ring-black/5 lg:sticky lg:top-6 lg:self-start">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-light">Category pages</h2>
                <span className="rounded-full bg-[#f7f3ee] px-2.5 py-1 text-xs text-text-light">{categoryPages.length}</span>
              </div>
              <div className="mt-4 space-y-2">
                {categoryPages.length > 0 ? (
                  categoryPages.map((page) => (
                    <button
                      key={page.label}
                      type="button"
                      onClick={() => setActiveCategory(page.categoryId ?? "all")}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                        activeCategory === page.categoryId
                          ? "bg-brand-blue text-white shadow-sm"
                          : "bg-[#faf7f2] text-foreground hover:bg-[#f4ede4]"
                      }`}
                    >
                      <span className="font-medium">{page.label}</span>
                      <span className={`text-xs ${activeCategory === page.categoryId ? "text-white/80" : "text-text-light"}`}>
                        {page.items.length}
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
              <div
                key={dish.id}
                className="rounded-3xl bg-white/85 p-6 shadow-[0_18px_60px_rgba(31,26,23,0.08)] ring-1 ring-black/5"
              >
                {/* Dish Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-3">
                    {editing.type === "dish" && editing.dishId === dish.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={dishFormData.name}
                          onChange={(e) =>
                            setDishFormData({
                              ...dishFormData,
                              name: e.target.value,
                            })
                          }
                          className="input-brand w-full rounded-2xl border-0 bg-[#faf7f2] text-sm"
                        />
                        <textarea
                          value={dishFormData.description}
                          onChange={(e) =>
                            setDishFormData({
                              ...dishFormData,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className="input-brand w-full rounded-2xl border-0 bg-[#faf7f2] text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateDish(dish.id)}
                            className="flex-1 rounded-full bg-brand-blue py-2 text-sm font-medium text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditing({ type: "none" })}
                            className="flex-1 rounded-full bg-[#f7f3ee] py-2 text-sm font-medium text-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold font-bungee text-foreground">
                            {dish.name}
                          </h3>
                          <span className="rounded-full bg-[#f7f3ee] px-3 py-1 text-xs font-medium text-text-light">
                            Category {dish.category_id ?? "none"}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              dish.is_active ?? true
                                ? "bg-[#eef8f4] text-[#2c7a5a]"
                                : "bg-[#faf0ef] text-brand-red"
                            }`}
                          >
                            {dish.is_active ?? true ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {dish.description && <p className="max-w-3xl text-sm leading-6 text-light">{dish.description}</p>}
                        <button
                          onClick={() => {
                            setDishFormData({
                              name: dish.name,
                              description: dish.description || "",
                            });
                            setEditing({ type: "dish", dishId: dish.id });
                          }}
                          className="text-sm font-medium text-brand-blue hover:text-accent-blue"
                        >
                          Edit Dish
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      handleToggleDish(dish.id, dish.is_active ?? true)
                    }
                    className={`rounded-full px-4 py-2 font-medium transition-all duration-200 ${
                      dish.is_active ?? true
                        ? "bg-[#fdf0ef] text-brand-red"
                        : "bg-[#eef5ff] text-brand-blue"
                    }`}
                  >
                    {dish.is_active ?? true ? "Disable" : "Enable"}
                  </button>
                </div>

                {/* Variants Section */}
                {dish.item_variants && (
                  <div className="mt-6 border-t border-black/5 pt-6">
                    <p className="mb-4 text-sm font-bold text-foreground">
                      Variants ({dish.item_variants.length})
                    </p>

                    {/* Add Variant Form */}
                    <div className="mb-4 rounded-2xl bg-[#faf7f2] p-4 ring-1 ring-black/5">
                      <div className="grid gap-2 md:grid-cols-[minmax(0,1.2fr)_120px_auto]">
                        <div className="space-y-2">
                          <label htmlFor={`${variantNameInputId}-${dish.id}`} className="block text-xs font-medium text-text-light">
                            Variant name
                          </label>
                        <input
                          id={`${variantNameInputId}-${dish.id}`}
                          type="text"
                          value={variantFormData.name}
                          onChange={(e) =>
                            setVariantFormData({
                              ...variantFormData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Variant name"
                          className="input-brand rounded-2xl border-0 bg-white text-sm"
                        />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`${variantPriceInputId}-${dish.id}`} className="block text-xs font-medium text-text-light">
                            Price
                          </label>
                        <input
                          id={`${variantPriceInputId}-${dish.id}`}
                          type="number"
                          value={variantFormData.price}
                          onChange={(e) =>
                            setVariantFormData({
                              ...variantFormData,
                              price: e.target.value,
                            })
                          }
                          placeholder="Price"
                          step="0.01"
                          className="input-brand rounded-2xl border-0 bg-white text-sm"
                        />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleCreateVariant(dish.id);
                          }}
                          className="rounded-2xl bg-brand-blue px-4 py-3 text-sm font-medium text-white"
                        >
                          Add Variant
                        </button>
                      </div>
                    </div>

                    {/* Variants List */}
                    {dish.item_variants.length === 0 ? (
                      <p className="text-sm text-light">No variants</p>
                    ) : (
                      <div className="space-y-2">
                        {dish.item_variants.map((variant) => (
                          <div
                            key={variant.id}
                            className="flex flex-col gap-3 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between"
                          >
                            {editing.type === "variant" &&
                            editing.variantId === variant.id ? (
                              <div className="flex-1 grid gap-2 md:grid-cols-[minmax(0,1fr)_120px_auto_auto]">
                                <input
                                  type="text"
                                  value={variantFormData.name}
                                  onChange={(e) =>
                                    setVariantFormData({
                                      ...variantFormData,
                                      name: e.target.value,
                                    })
                                  }
                                  className="input-brand rounded-2xl border-0 bg-white text-sm"
                                />
                                <input
                                  type="number"
                                  value={variantFormData.price}
                                  onChange={(e) =>
                                    setVariantFormData({
                                      ...variantFormData,
                                      price: e.target.value,
                                    })
                                  }
                                  step="0.01"
                                  className="input-brand rounded-2xl border-0 bg-white text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateVariant(variant.id)
                                  }
                                  className="rounded-2xl bg-brand-blue px-4 py-2 text-sm font-medium text-white"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditing({ type: "none" })}
                                  className="rounded-2xl bg-[#f7f3ee] px-4 py-2 text-sm font-medium text-foreground"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground">
                                    {variant.variant_name ||
                                      `Variant ${variant.id}`}
                                  </p>
                                  <p className="text-sm text-light">
                                    ${variant.price}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                      variant.is_active ?? true
                                        ? "bg-[#eef5ff] text-brand-blue"
                                        : "bg-[#faf0ef] text-brand-red"
                                    }`}
                                  >
                                    {variant.is_active ?? true
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVariantFormData({
                                        name: variant.variant_name || "",
                                        price: String(variant.price),
                                      });
                                      setEditing({
                                        type: "variant",
                                        variantId: variant.id,
                                      });
                                    }}
                                    className="text-xs font-medium text-brand-blue hover:text-accent-blue"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleVariant(
                                        variant.id,
                                        variant.is_active ?? true,
                                      )
                                    }
                                    className="text-xs font-medium text-brand-red hover:text-rose"
                                  >
                                    {variant.is_active ?? true
                                      ? "Disable"
                                      : "Enable"}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
