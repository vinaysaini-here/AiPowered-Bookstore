"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { MapPin, CreditCard } from "lucide-react";

type Address = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const emptyAddress: Address = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const { cartItems, clearCart, fetchCart } = useCartStore();
  const { user, checkAuth } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [hasAddress, setHasAddress] = useState(false);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [editingAddress, setEditingAddress] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=checkout");
      return;
    }

    const loadCheckout = async () => {
      try {
        await fetchCart();
        const { data } = await api.get("/orders/address");
        setHasAddress(data.hasAddress);
        setAddress(data.address || { ...emptyAddress, fullName: user.name || "" });
        setEditingAddress(!data.hasAddress);
      } catch {
        toast.error("Failed to load checkout details");
      } finally {
        setAddressLoading(false);
      }
    };

    loadCheckout();
  }, [fetchCart, router, user]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((current) => ({ ...current, [field]: value }));
  };

  const saveAddress = async () => {
    try {
      const { data } = await api.put("/orders/address", address);
      setHasAddress(data.hasAddress);
      setAddress(data.address);
      setEditingAddress(false);
      toast.success("Address saved");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login?redirect=checkout");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!hasAddress) {
      toast.error("Please save your address before payment");
      setEditingAddress(true);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/orders/checkout");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_id",
        amount: data.amount,
        currency: data.currency || "INR",
        name: "AI Bookstore",
        description: "Book order payment",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const { data: verifyData } = await api.post("/orders/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful!");
            await clearCart();
            router.push(`/profile?order=${verifyData.order._id}`);
          } catch (error: any) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: address.phone,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!user || addressLoading) {
    return <div className="min-h-screen pt-24 text-center font-semibold text-slate-700">Loading checkout...</div>;
  }

  if (cartItems.length === 0) {
    return <div className="min-h-screen pt-24 text-center">Cart is empty.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between gap-4 border-b pb-4 mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="text-indigo-600" />
                  Delivery Address
                </h1>
                {hasAddress && !editingAddress && (
                  <button onClick={() => setEditingAddress(true)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                    Edit
                  </button>
                )}
              </div>

              {editingAddress ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {([
                    ["fullName", "Full name"],
                    ["phone", "Phone"],
                    ["address", "Address"],
                    ["city", "City"],
                    ["state", "State"],
                    ["pincode", "Pincode"],
                  ] as [keyof Address, string][]).map(([field, label]) => (
                    <label key={field} className={field === "address" ? "sm:col-span-2" : ""}>
                      <span className="block text-sm font-medium text-slate-700 mb-2">{label}</span>
                      <input
                        value={address[field]}
                        onChange={(event) => handleAddressChange(field, event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  ))}
                  <button onClick={saveAddress} className="sm:col-span-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700">
                    Save Address
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-slate-700">
                  <p className="font-bold text-slate-900">{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p>{address.address}, {address.city}</p>
                  <p>{address.state} - {address.pincode}</p>
                </div>
              )}
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 border-b pb-4">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center py-2">
                    <span className="text-slate-700 font-medium">{item.title} (x{item.qty})</span>
                    <span className="text-slate-900 font-bold">Rs. {item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Payment Summary</h2>
            <div className="border-t border-slate-200 pt-6 mb-8 flex justify-between items-center text-xl">
              <span className="font-bold text-slate-900">Total Due</span>
              <span className="font-extrabold text-indigo-600">Rs. {total}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || editingAddress}
              className="w-full py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>
            {editingAddress && (
              <p className="mt-3 text-center text-sm text-slate-500">Save your address to continue.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
