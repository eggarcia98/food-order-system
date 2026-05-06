"use client";

import { useEffect, useState } from "react";
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
    <div className="min-h-[calc(100vh-200px)] bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-wider font-bungee text-foreground">
            Manage Dishes
          </h1>
          <button
            onClick={() => {
              setShowAddDish(!showAddDish);
              setDishFormData({ name: "", description: "" });
            }}
            className="btn-brand-blue px-6 py-2 rounded-lg font-medium transition-all duration-200"
          >
            {showAddDish ? "Cancel" : "Create Dish"}
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-light-pink border-2 border-brand-red rounded-lg">
            <p className="text-brand-red font-medium">{error}</p>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-soft-blue border-2 border-accent-blue rounded-lg">
            <p className="text-brand-blue font-medium">{successMsg}</p>
          </div>
        )}

        {/* CREATE Form */}
        {showAddDish && (
          <div className="mb-8 p-6 bg-cream border-3 border-brand rounded-lg shadow-lg">
            <h2 className="text-xl font-bold font-bungee text-foreground mb-4">
              Create New Dish
            </h2>
            <form onSubmit={handleCreateDish} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Dish Name *
                </label>
                <input
                  type="text"
                  value={dishFormData.name}
                  onChange={(e) =>
                    setDishFormData({ ...dishFormData, name: e.target.value })
                  }
                  placeholder="Enter dish name"
                  className="input-brand w-full rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={dishFormData.description}
                  onChange={(e) =>
                    setDishFormData({
                      ...dishFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter dish description"
                  rows={3}
                  className="input-brand w-full rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full btn-brand-blue py-3 rounded-lg font-medium transition-all duration-200"
              >
                Create Dish
              </button>
            </form>
          </div>
        )}

        {/* READ: Dishes List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-light">Loading dishes...</p>
          </div>
        ) : dishes.length === 0 ? (
          <div className="text-center py-12 bg-cream border-3 border-brand rounded-lg">
            <p className="text-light">No dishes yet. Create your first!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-cream border-3 border-brand rounded-lg shadow-lg p-6"
              >
                {/* Dish Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
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
                          className="input-brand w-full rounded-lg text-sm"
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
                          className="input-brand w-full rounded-lg text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateDish(dish.id)}
                            className="flex-1 btn-brand-blue py-2 rounded-lg text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditing({ type: "none" })}
                            className="flex-1 bg-soft-pink text-brand-red py-2 rounded-lg text-sm font-medium border border-rose"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold font-bungee text-foreground">
                          {dish.name}
                        </h3>
                        {dish.description && (
                          <p className="text-light mt-2">
                            {dish.description}
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setDishFormData({
                              name: dish.name,
                              description: dish.description || "",
                            });
                            setEditing({ type: "dish", dishId: dish.id });
                          }}
                          className="text-sm text-brand-blue hover:text-accent-blue font-medium mt-2"
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
                    className={`px-4 py-2 rounded-lg font-medium text-cream transition-all duration-200 ${
                      dish.is_active ?? true
                        ? "btn-brand-red hover:bg-rose"
                        : "bg-soft-blue text-brand-blue border border-accent-blue"
                    }`}
                  >
                    {dish.is_active ?? true ? "Disable" : "Enable"}
                  </button>
                </div>

                {/* Variants Section */}
                {dish.item_variants && (
                  <div className="mt-6 pt-6 border-t border-soft-pink">
                    <p className="text-sm font-bold text-foreground mb-4">
                      Variants ({dish.item_variants.length})
                    </p>

                    {/* Add Variant Form */}
                    <div className="mb-4 p-4 bg-soft-pink border border-rose rounded-lg">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <input
                          type="text"
                          value={variantFormData.name}
                          onChange={(e) =>
                            setVariantFormData({
                              ...variantFormData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Variant name"
                          className="input-brand rounded-lg text-sm"
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
                          placeholder="Price"
                          step="0.01"
                          className="input-brand rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            handleCreateVariant(dish.id);
                          }}
                          className="btn-brand-blue rounded-lg text-sm font-medium"
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
                            className="flex justify-between items-center p-3 bg-soft-blue border border-accent-blue rounded-lg"
                          >
                            {editing.type === "variant" &&
                            editing.variantId === variant.id ? (
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  value={variantFormData.name}
                                  onChange={(e) =>
                                    setVariantFormData({
                                      ...variantFormData,
                                      name: e.target.value,
                                    })
                                  }
                                  className="flex-1 input-brand rounded-lg text-sm"
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
                                  className="w-20 input-brand rounded-lg text-sm"
                                />
                                <button
                                  onClick={() =>
                                    handleUpdateVariant(variant.id)
                                  }
                                  className="px-3 btn-brand-blue rounded-lg text-sm font-medium"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditing({ type: "none" })}
                                  className="px-3 bg-soft-pink text-brand-red rounded-lg text-sm font-medium border border-rose"
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
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded font-medium ${
                                      variant.is_active ?? true
                                        ? "bg-soft-blue text-brand-blue border border-accent-blue"
                                        : "bg-light-pink text-brand-red border border-rose"
                                    }`}
                                  >
                                    {variant.is_active ?? true
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                  <button
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
                                    className="text-xs text-brand-blue hover:text-accent-blue font-medium"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleToggleVariant(
                                        variant.id,
                                        variant.is_active ?? true,
                                      )
                                    }
                                    className="text-xs text-brand-red hover:text-rose font-medium"
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
        )}
      </div>
    </div>
  );
}
