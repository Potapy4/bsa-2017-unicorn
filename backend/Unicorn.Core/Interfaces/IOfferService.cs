﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unicorn.Shared.DTOs.Offer;

namespace Unicorn.Core.Interfaces
{
    public interface IOfferService
    {
        Task CreateOffersAsync(IEnumerable<ShortOfferDTO> offer);
        Task<IEnumerable<OfferDTO>> GetOffersAsync(long vendorId);
        Task UpdateOfferAsync(OfferDTO offer);
    }
}
