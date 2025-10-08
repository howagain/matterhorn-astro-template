import type { Component } from 'solid-js';
import { onMount, Show, createSignal } from 'solid-js';
import type { Coupon as CouponType } from '../../service/coupons/types/coupon.types';
import Modal from '../modal/Modal';
import { SendToPhoneForm } from './send-to-phone-form';


export const Coupon: Component<{coupon: CouponType, isPrintPage?: boolean}> = (props) => {
    const [isModalOpen, setIsModalOpen] = createSignal(false);

    onMount(() => {
        if(props.isPrintPage) {
            setTimeout(() => window.print(), 100);
        }
    })

    return (
        <div class="max-w-md mx-auto flex flex-col gap-4 p-4 border-2 rounded-lg">
            <Show when={props.coupon.imageUrl}>
                <img class="w-full" src={props.coupon.imageUrl} />
            </Show>
            <Show when={props.coupon.title || props.coupon.services.length > 0}>
            <div class='flex flex-col border-2 rounded-lg'>
                <div class="px-6 py-3 bg-gray-50 border-b-2">
                    <h2 class="text-xl font-bold text-center">{props.coupon.title}</h2>
                </div>
                <div>
                    <ul class="px-6 py-3">
                        {props.coupon.services.map((service) => (
                            <li>{service}</li>
                        ))}
                    </ul>
                </div>
            </div>
            </Show>
            <Show when={!props.isPrintPage}>
                <a 
                    class="flex-1 px-6 py-3 bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:bg-gray-100"
                    href='https://www.gillespieford.com/service-appointment'

                >
                    Schedule Service
                </a>
                <div class="flex gap-4 flex-col md:flex-row">
                    <a 
                        class="flex-1 px-6 py-3 bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:bg-gray-100 text-sm"
                        href={`/coupon/${props.coupon.id}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                        </svg>
                        Print Coupon
                    </a>
                    <Modal 
                        trigger={
                            <button 
                                class="flex-1 w-full px-6 py-3 bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:bg-gray-100 text-sm"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
                                </svg>
                                Send to Phone
                            </button>
                        }
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    >
                        <SendToPhoneForm setModalOpen={setIsModalOpen}/>
                    </Modal>
     
                </div>
            </Show>
        </div>
    );
};