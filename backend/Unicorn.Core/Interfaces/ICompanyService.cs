﻿using System.Collections;
using System.Threading.Tasks;
using Unicorn.Core.DTOs;

namespace Unicorn.Core.Interfaces
{
    public interface ICompanyService
    {
        Task<IEnumerable> GetAllCompaniesAsync();
        Task<object> GetCompanyByIdAsync(long id);
    }
}