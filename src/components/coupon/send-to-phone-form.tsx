import { createSignal, type Component, type Setter } from "solid-js";

export const SendToPhoneForm: Component<{setModalOpen: Setter<boolean>}> = (props) => {
    const [phoneNumber, setPhoneNumber] = createSignal("");
    const [carrier, setCarrier] = createSignal("");

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Phone:", `${phoneNumber()}`);
        console.log("Carrier:", carrier());
        props.setModalOpen(false);
    };

    return (
        <div class="bg-white p-6 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Mobile Phone Information</h2>
            
            <form onSubmit={handleSubmit} class="space-y-6">
                {/* Phone Number Section */}
                <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div class="w-full">
                        <label class="block text-gray-700 font-medium mb-2">
                            Mobile Phone #*
                        </label>
                        
                            <input
                                type="text"
                                value={phoneNumber()}
                                onInput={(e) => setPhoneNumber(e.currentTarget.value)}
                                maxLength={10}
                                class="w-full px-3 py-2 border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                            />
                        
                    </div>

                    {/* Mobile Carrier Section */}
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">
                            Mobile Carrier*
                        </label>
                        <div class="relative">
                            <select
                                value={carrier()}
                                onChange={(e) => setCarrier(e.currentTarget.value)}
                                class="w-full px-3 py-2 pr-10 border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                            <option value="" disabled selected>Select Carrier</option>
                                <option value="verizon">Verizon</option>
                                <option value="att">AT&T</option>
                                <option value="tmobile">T-Mobile</option>
                                <option value="sprint">Sprint</option>
                                <option value="other">Other</option>
                            </select>
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Policy Text */}
                <div class="text-gray-600 text-sm">
                    By submitting your information, you agree to our{" "}
                    <a 
                        href="/privacy-policy" 
                        class="text-blue-600 underline hover:text-blue-800"
                    >
                        Privacy Policy
                    </a>
                    .
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 text-lg tracking-wide transition-colors duration-200"
                >
                    SUBMIT FORM
                </button>
            </form>
        </div>
    );
};