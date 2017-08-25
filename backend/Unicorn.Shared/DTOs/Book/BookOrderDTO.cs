﻿using System;

namespace Unicorn.Shared.DTOs.Book
{
    public class BookOrderDTO
    {
        public LocationDTO Location { get; set; }
        public long CustomerId { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Profile { get; set; }
        public long ProfileId { get; set; }       
        public long WorkId { get; set; }
    }
}