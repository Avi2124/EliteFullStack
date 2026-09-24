import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSupplierById, updateSupplier } from "../../services/supplierService";

const EditSupplier = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSupplier = async () => {
            if (!id) {
                setError("Supplier Id is missing.");
                setLoading(false);
                return;
            }

            try {
                const supplier = await getSupplierById(id);
                setName(supplier.name);
                setEmail(supplier.email);
                setPhone(supplier.phone);
            } catch (error) {
                console.error("Failed to load supplier:", error);
            } finally {
                setLoading(false);
            }
        };
    }, [id]);

    const handleSubmit = async (event: FormEvent<HTMLElement>) => {
        event.preventDefault();
        if(!id) {
            return;
        }
        setError("");
        if(!name.trim() || !email.trim() || !phone.trim()) {
            setError("Please fill all fields.");
            return;
        }

        try {
            setSaving(true);
            await updateSupplier(id, {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim()
            });
            navigate("/suppliers");
        } catch (error) {
            console.error("Failed to update supplier:", error);
            setError("Failed to update supplier.");
        } finally {
            setSaving(false);
        }
    };

    if(loading) {
        return <div>Loading supplier...</div>;
    }
  return (
    <div>
      
    </div>
  )
}

export default EditSupplier

//     return (
//         <div className="products-page">
//             <div className="products-page__header">
//                 <div>
//                     <h1>Edit Supplier</h1>
//                     <p>Update supplier information.</p>
//                 </div>
//             </div>

//             <div className="products-card">
//                 <form
//                     className="product-form"
//                     onSubmit={handleSubmit}
//                 >
//                     <div className="product-form__group">
//                         <label htmlFor="name">
//                             Supplier Name
//                         </label>

//                         <input
//                             id="name"
//                             type="text"
//                             value={name}
//                             onChange={(event) =>
//                                 setName(event.target.value)
//                             }
//                         />
//                     </div>

//                     <div className="product-form__group">
//                         <label htmlFor="email">
//                             Email
//                         </label>

//                         <input
//                             id="email"
//                             type="email"
//                             value={email}
//                             onChange={(event) =>
//                                 setEmail(event.target.value)
//                             }
//                         />
//                     </div>

//                     <div className="product-form__group">
//                         <label htmlFor="phone">
//                             Phone
//                         </label>

//                         <input
//                             id="phone"
//                             type="text"
//                             value={phone}
//                             onChange={(event) =>
//                                 setPhone(event.target.value)
//                             }
//                         />
//                     </div>

//                     {error && (
//                         <div className="product-form__error">
//                             {error}
//                         </div>
//                     )}

//                     <div className="product-form__actions">
//                         <button
//                             type="button"
//                             onClick={() =>
//                                 navigate("/suppliers")
//                             }
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={saving}
//                         >
//                             {saving
//                                 ? "Updating..."
//                                 : "Update Supplier"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default EditSupplier;