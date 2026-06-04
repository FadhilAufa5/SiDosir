<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('no_karyawan', 20)->nullable()->unique()->after('name');
            $table->enum('role', ['admin', 'customer_services'])->default('customer_services')->after('email');
            $table->string('no_hp', 20)->nullable()->after('role');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif')->after('no_hp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['no_karyawan', 'role', 'no_hp', 'status']);
        });
    }
};
