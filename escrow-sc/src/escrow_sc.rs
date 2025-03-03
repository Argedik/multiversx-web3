#![no_std]

#[allow(unused_imports)]
use multiversx_sc::imports::*;
use multiversx_sc::derive_imports::*;

pub type OfferId = u64;

#[type_abi]
#[derive(TopEncode, TopDecode)]
pub struct Offer<M: ManagedTypeApi> {
    pub creator: ManagedAddress<M>,
    pub offered_payment: EsdtTokenPayment<M>,
    pub accepted_payment: EsdtTokenPayment<M>,
    pub accepted_address: ManagedAddress<M>,
}

/// An empty contract. To be used as a template when starting a new contract from scratch.
#[multiversx_sc::contract]
pub trait EscrowSc {
    #[init]
    fn init(&self) {}

    #[upgrade]
    fn upgrade(&self) {}

    #[storage_mapper("offers")]
    fn offers(&self, id : OfferId) -> SingleValueMapper<Offer<Self::Api>>;

    #[storage_mapper("lastOfferId")]
    fn last_offer_id(&self) -> SingleValueMapper<OfferId>;
}
