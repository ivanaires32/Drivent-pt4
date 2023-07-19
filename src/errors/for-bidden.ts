import { ApplicationError } from '@/protocols';

export function forBiddenBooking(): ApplicationError {
    return {
        name: 'ForBiddenBooking',
        message: 'You cannot make reservations',
    };
}
