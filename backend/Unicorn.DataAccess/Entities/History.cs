﻿using System;

namespace Unicorn.DataAccess.Entities
{
    public class History
    {
        public long Id { get; set; }
        
        public long CustomerId { get; set; }

        public string CustomerName { get; set; }

        public long VendorId { get; set; }

        public string VendorName { get; set; }

        public DateTime Date { get; set; }

        public string BookDescription { get; set; }

        public string WorkDescription { get; set; }

        public string CategoryName { get; set; }

        public string SubcategoryName { get; set; }
    }
}