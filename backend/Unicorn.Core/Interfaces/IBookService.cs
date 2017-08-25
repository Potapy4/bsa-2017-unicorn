﻿using System.Collections.Generic;
using System.Threading.Tasks;

using Unicorn.Shared.DTOs;
using Unicorn.Shared.DTOs.Book;

namespace Unicorn.Core.Interfaces
{
    public interface IBookService
    {
        Task<IEnumerable<BookDTO>> GetAllAsync();
        Task<BookDTO> GetByIdAsync(long id);
        Task<IEnumerable<VendorBookDTO>> GetVendorOrdersAsync(long vendorId);
        Task Create(BookOrderDTO book);
        Task Update(BookDTO book);
        Task<IEnumerable<VendorBookDTO>> GetOrdersAsync(string role, long id);
        Task<IEnumerable<VendorBookDTO>> GetPendingOrdersAsync(string role, long id);
        Task<IEnumerable<VendorBookDTO>> GetAcceptedOrdersAsync(string role, long id);
        Task<IEnumerable<VendorBookDTO>> GetFinishedOrdersAsync(string role, long id);
    }
}
