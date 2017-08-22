﻿using System;
using Unicorn.DataAccess.Entities;
using Unicorn.Shared.DTOs.Vendor;

namespace Unicorn.Shared.DTOs.Book
{
    public class BookDTO
    {
        public long Id { get; set; }

        public DateTime Date { get; set; }

        public BookStatus Status { get; set; }

        public string Description { get; set; }


        public CustomerDTO Customer { get; set; }

        public VendorDTO Vendor { get; set; }

        public CompanyDTO Company { get; set; }

        public WorkDTO Work { get; set; }

        public LocationDTO Location { get; set; }
    }
}