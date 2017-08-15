﻿using Unicorn.DataAccess.Interfaces;

namespace Unicorn.DataAccess.Entities
{
    public class PortfolioItem : IEntity
    {
        public long Id { get; set; }
        public string Image { get; set; }
        public long HistoryEntryId { get; set; }

        public bool IsDeleted { get; set; }
    }
}
