﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using Unicorn.Core.Interfaces;
using Unicorn.Shared.DTOs.Book;

namespace Unicorn.Controllers
{
    [EnableCors("*", "*", "*")]
    public class BookController : ApiController
    {
        private IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpPost]
        [Route("{id}/order")]
        public async Task<HttpResponseMessage> Order(BookOrderDTO book)
        {
            try
            {
                await _bookService.Create(book);
            }
            catch
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpGet]
        [Route("book/{role}/{id}")]
        public async Task<HttpResponseMessage> GetVendorBooks(string role, long id)
        {
            IEnumerable<VendorBookDTO> books;
            try
            {
                books = await _bookService.GetOrdersAsync(role, id);
            }
            catch
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            return Request.CreateResponse(books);
        }
    }
}
