@section('content')
    <div class="row">
        @if (hasPermit(['']))

            <div class="col-lg-10 col-md-8 col-12">
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">From</span>
                        </div>
                        <input id="from_date" type="text" class="form-control" data-plugin="datepicker" name="from" />
                        <div class="input-group-prepend">
                            <span class="input-group-text">To</span>
                        </div>
                        <input id="to_date" type="text" class="form-control" data-plugin="datepicker" name="to" />
                    </div>
                </div>
            </div>

            <div class="col-lg-2 col-md-4 col-12">
                <div class="form-group">
                    <div class="btn-group btn-group-toggle btn-group-justified" data-toggle="buttons">
                        <label class="btn btn-primary active">
                            <input type="radio" name="type" value="Mobile" id="mobile" checked autocomplete="off"> Mobile
                        </label>
                        <label class="btn btn-primary">
                            <input type="radio" name="type" value="Walk-in" id="walkin" autocomplete="off"> Walkin
                        </label>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="panel p-20" data-load-callback="customRefreshCallback">
                    <div class="cards-wrapper">
                        <div>
                            <i class="icon site-menu-icon md-markunread-mailbox" aria-hidden="true"></i>
                            <strong>Active Lockers</strong>
                            <span id="totalActiveLockers"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-mall" aria-hidden="true"></i>
                            <strong>Orders Received</strong>
                            <span id="totalOrdersRecived"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-mall" aria-hidden="true"></i>
                            <strong>Orders Submitted</strong>
                            <span id="totalOrdersSubmitted"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-mall" aria-hidden="true"></i>
                            <strong>Orders Dispatched</strong>
                            <span id="totalOrdersDispatched"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-mall" aria-hidden="true"></i>
                            <strong>Orders in- kitchen</strong>
                            <span id="totalOrdersKitchen"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-mall" aria-hidden="true"></i>
                            <strong>Fake Orders</strong>
                            <span id="totalFakeOrders"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-accounts-alt" aria-hidden="true"></i>
                            <strong>Active Recurring Customers</strong>
                            <span id="totalActiveRecurringCustomers"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-card" aria-hidden="true"></i>
                            <strong>Topup-cards Amount</strong>
                            <span id="totalTopCardAmount"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-card" aria-hidden="true"></i>
                            <strong>Credit Cards Payment</strong>
                            <span id="totalCreditCardPayment"></span>
                        </div>
                        <div>
                            <i class="icon site-menu-icon md-card" aria-hidden="true"></i>
                            <strong>Credit Payment</strong>
                            <span id="totalCreditPayment"></span>
                        </div>
                    </div>
                </div>
            </div>
        @endif
    @endsection



    @section('js')
        <script src="{{ url('assets/vendor/datatables.net/jquery.dataTables.js') }}"></script>
        <script src="{{ url('assets/vendor/datatables.net-bs4/dataTables.bootstrap4.js') }}"></script>
        <script src="{{ url('assets/vendor/datatables.net-responsive/dataTables.responsive.js') }}"></script>
        <script src="{{ url('assets/vendor/datatables.net-responsive-bs4/responsive.bootstrap4.js') }}"></script>

        <script type="text/javascript">
            let defaultFromDate = getDefaultFromDate();
            let defaultToDate = getDefaultToDate();
            let dashboard = '?dashboard=true'
            let from_date = `&from_date=${defaultFromDate}`;
            let to_date = `&to_date=0${defaultToDate}`;
            let type = '&type=0';

            getActiveLockersCount();
            getOrdersNumberByStatus('Fake', 'totalFakeOrders');
            getOrdersNumberByStatus('Received', 'totalOrdersRecived');
            getOrdersNumberByStatus('Submitted', 'totalOrdersSubmitted');
            getOrdersNumberByStatus('Dispatched', 'totalOrdersDispatched');
            getOrdersNumberByStatus('InKitchen', 'totalOrdersKitchen');

            getCreditCardsAmount('Topup', 'totalTopCardAmount');
            getCreditCardsAmount('Credit_Card', 'totalCreditCardPayment');
            getCreditCardsAmount('Credit', 'totalCreditPayment');

            getActiveCustomers();


            $('#from_date, #to_date, input[name=type]').on("change", function() {

                from_date = $('#from_date').val() ? '&from_date=' + formatDate($('#from_date').val()) :
                    '&from_date=0';

                to_date = $('#to_date').val() ? '&to_date=' + formatDate($('#to_date').val()) : '&to_date=0';

                type = $('input[name=type]:checked').val() ? '&y_type=' + $('input[name=type]:checked').val() :
                    '&y_type=0';

                getActiveLockersCount();
                getOrdersNumberByStatus('Fake', 'totalFakeOrders');
                getOrdersNumberByStatus('Received', 'totalOrdersRecived');
                getOrdersNumberByStatus('Submitted', 'totalOrdersSubmitted');
                getOrdersNumberByStatus('Dispatched', 'totalOrdersDispatched');
                getOrdersNumberByStatus('InKitchen', 'totalOrdersKitchen');

                getCreditCardsAmount('Topup', 'totalTopCardAmount');
                getCreditCardsAmount('Credit_Card', 'totalCreditCardPayment');
                getCreditCardsAmount('Credit', 'totalCreditPayment');

                getActiveCustomers();

            });

            function getActiveLockersCount() {
                $.ajax({
                    url: '/dashboard/lockers/get-active-lockers' + dashboard + from_date + to_date,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        document.getElementById('totalActiveLockers').innerText = data;
                    }
                });
            }

            function getOrdersNumberByStatus(status, id) {
                let urlStatus = "&status=" + status;
                $.ajax({
                    url: '/dashboard/orders/get-orders-numbers' + dashboard + urlStatus + from_date + to_date,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        document.getElementById(id).innerText = data;
                    }
                });
            }

            function getCreditCardsAmount(type, id) {
                $.ajax({
                    url: `/dashboard/credits/credits-amount/${type}` + dashboard + from_date + to_date,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        document.getElementById(id).innerText = data;
                    }
                });
            }

            function getActiveCustomers() {
                $.ajax({
                    url: `/dashboard/users/active-customers/` + dashboard + from_date + to_date,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        document.getElementById('totalActiveRecurringCustomers').innerText = data;
                    }
                });
            }

            function getDefaultFromDate() {
                let d = new Date();
                let curr_month = d.getMonth() + 1;
                let curr_year = d.getFullYear();

                if (curr_month < 9) {
                    curr_month = '0' + curr_month;
                }
                let defaultFromDate = formatDate(curr_month + "-" + "01" + "-" + curr_year);
                let placeholderDate = curr_month + "-" + "01" + "-" + curr_year;
                $('#from_date').val(placeholderDate);
                return defaultFromDate;
            }

            function getDefaultToDate() {
                let d = new Date();
                let curr_day = d.getDate();
                let curr_month = d.getMonth() + 1;
                let curr_year = d.getFullYear();

                if (curr_day < 9) {
                    curr_day = '0' + curr_day;
                }

                if (curr_month < 9) {
                    curr_month = '0' + curr_month;
                }
                let defaultToDate = formatDate(curr_month + "-" + (curr_day > 31 ? 31 : curr_day) + "-" + curr_year);
                let placeholderDate = curr_month + "-" + (curr_day) + "-" + curr_year;
                $('#to_date').val(placeholderDate);
                return defaultToDate;
            }

            function formatDate(date) {
                let d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }

        </script>
    @endsection
